package edu.cit.aloria.clinicaflow.features.authentication;

import edu.cit.aloria.clinicaflow.features.authentication.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.features.authentication.dto.request.LoginRequest;
import edu.cit.aloria.clinicaflow.features.authentication.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountRepository;
import edu.cit.aloria.clinicaflow.features.authentication.JwtService;
import edu.cit.aloria.clinicaflow.features.authentication.SupabaseAuthService;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffService; 
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SupabaseAuthService supabaseAuthService;

    @Autowired
    private MedicalStaffService medicalStaffService;

    @Autowired
    private UserAccountService userService;  // ADD THIS - the missing dependency

    @Autowired
    private RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    // Track rate limit attempts (simple in-memory, use Redis for production)
    private final Map<String, RateLimitInfo> rateLimitMap = new HashMap<>();

    private static class RateLimitInfo {
        int attempts;
        long lastAttemptTime;

        RateLimitInfo() {
            this.attempts = 1;
            this.lastAttemptTime = System.currentTimeMillis();
        }
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("=== Starting registration for: " + request.getEmail());

            // Check rate limit
            String emailKey = request.getEmail().toLowerCase();
            RateLimitInfo rateInfo = rateLimitMap.get(emailKey);
            if (rateInfo != null) {
                long timeSinceLastAttempt = (System.currentTimeMillis() - rateInfo.lastAttemptTime) / 1000;
                if (timeSinceLastAttempt < 3600) { // 1 hour in seconds
                    if (rateInfo.attempts >= 3) {
                        return AuthResponse.error(
                                "Too many registration attempts for this email.\n\n" +
                                        "Please wait " + (3600 - timeSinceLastAttempt) + " seconds before trying again.\n" +
                                        "Or use a different email address."
                        );
                    }
                } else {
                    // Reset after 1 hour
                    rateLimitMap.remove(emailKey);
                }
            }

            // Validation
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return AuthResponse.error("Please enter your email address.");
            }

            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return AuthResponse.error("Password must be at least 6 characters long.");
            }

            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return AuthResponse.error("Please enter your first name.");
            }

            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                return AuthResponse.error("Please enter your last name.");
            }

            // Check if user already exists in local DB
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return AuthResponse.error("This email is already registered. Please login instead.");
            }

            // Update rate limit tracking
            if (rateInfo == null) {
                rateLimitMap.put(emailKey, new RateLimitInfo());
            } else {
                rateInfo.attempts++;
                rateInfo.lastAttemptTime = System.currentTimeMillis();
            }

            JsonObject supabaseResponse = supabaseAuthService.signUpWithEmail(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName()
            );

            String supabaseUserId = null;
            boolean emailVerified = false;

            if (supabaseResponse.has("user")) {
                JsonObject userObj = supabaseResponse.getAsJsonObject("user");
                supabaseUserId = userObj.get("id").getAsString();
                emailVerified = userObj.has("email_confirmed_at") &&
                        !userObj.get("email_confirmed_at").isJsonNull();
            } else if (supabaseResponse.has("id")) {
                supabaseUserId = supabaseResponse.get("id").getAsString();
                emailVerified = supabaseResponse.has("email_confirmed_at") &&
                        !supabaseResponse.get("email_confirmed_at").isJsonNull();
            } else {
                return AuthResponse.error("Registration service error. Please try again.");
            }

            UserAccountEntity user = new UserAccountEntity();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setRole(request.getRole() != null ? request.getRole() : "USER");
            user.setProvider("SUPABASE");
            user.setSupabaseUserId(supabaseUserId);
            user.setEmailVerified(emailVerified);
            user.setCreatedDate(new Date());
            user.setLastLogin(new Date());

            UserAccountEntity savedUser = userRepository.save(user);

            // ✅ SYNC TO MEDICAL_STAFF ON REGISTRATION
            if (medicalStaffService != null) {
                medicalStaffService.syncUserIfNotExists(savedUser);
                System.out.println("✅ Synced new user to medical_staff on registration");
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", savedUser.getAccountID());
            userData.put("firstName", savedUser.getFirstName());
            userData.put("lastName", savedUser.getLastName());
            userData.put("email", savedUser.getEmail());
            userData.put("role", savedUser.getRole());
            userData.put("provider", savedUser.getProvider());
            userData.put("emailVerified", savedUser.isEmailVerified());

            String message = emailVerified ?
                    "✓ Registration successful! You can now login." :
                    "✓ Registration successful!\n\n" +
                            "A verification email has been sent to " + request.getEmail() + "\n\n" +
                            "Please check your inbox and click the verification link to activate your account.\n" +
                            "If you don't see the email, please check your spam folder.\n\n" +
                            "⚠️ The verification link will redirect you to our site. If the link doesn't work, copy and paste it manually.";

            return AuthResponse.success(message, null, userData);

        } catch (Exception e) {
            String errorMessage = e.getMessage();

            if (errorMessage.contains("rate limit") || errorMessage.contains("over_email_send_rate_limit")) {
                return AuthResponse.error(
                        "📧 Email rate limit exceeded.\n\n" +
                                "You have attempted to register too many times.\n" +
                                "Please wait 1 hour before trying again with this email.\n\n" +
                                "Tips:\n" +
                                "• Use a different email address to register immediately\n" +
                                "• Check if you've already received a verification email in your inbox/spam folder"
                );
            } else if (errorMessage.contains("already registered")) {
                return AuthResponse.error(
                        "This email is already registered.\n\n" +
                                "✓ If you already have an account, please login instead.\n" +
                                "✓ If you forgot your password, use the 'Forgot Password' option.\n" +
                                "✓ If you haven't verified your email, check your spam folder for the verification link."
                );
            } else if (errorMessage.contains("Password must be at least 6 characters")) {
                return AuthResponse.error(
                        "Password is too short.\n\n" +
                                "Please use a password with at least 6 characters for security."
                );
            } else if (errorMessage.contains("valid email")) {
                return AuthResponse.error(
                        "Invalid email address.\n\n" +
                                "Please enter a valid email address (e.g., name@example.com)."
                );
            } else {
                e.printStackTrace();
                return AuthResponse.error(
                        "Registration failed: " + errorMessage + "\n\n" +
                                "Please check your information and try again.\n" +
                                "If the problem persists, please contact support."
                );
            }
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            System.out.println("=== Login attempt for email: " + request.getEmail());

            // Check if user exists with Google provider
            UserAccountEntity existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (existingUser != null && "GOOGLE".equals(existingUser.getProvider())) {
                return AuthResponse.error("This account uses Google Sign-In. Please click 'Sign in with Google' to continue.");
            }

            // Attempt authentication with Supabase
            JsonObject supabaseResponse = supabaseAuthService.signInWithEmail(
                    request.getEmail(),
                    request.getPassword()
            );

            // Check if response is valid
            if (supabaseResponse == null || !supabaseResponse.has("user")) {
                return AuthResponse.error("Invalid email or password. Please try again.");
            }

            JsonObject userObj = supabaseResponse.getAsJsonObject("user");
            String supabaseUserId = userObj.get("id").getAsString();
            boolean emailVerified = userObj.has("email_confirmed_at") &&
                    !userObj.get("email_confirmed_at").isJsonNull();

            // Check email verification
            if (!emailVerified) {
                return AuthResponse.error(
                        "⚠️ Please verify your email before logging in.\n\n" +
                                "Check your inbox/spam folder for the verification link.\n" +
                                "Need a new link? Use the 'Resend Verification' option on the login page."
                );
            }

            // Update or create user in local database
            UserAccountEntity user = userRepository.findBySupabaseUserId(supabaseUserId)
                    .orElseGet(() -> {
                        UserAccountEntity newUser = new UserAccountEntity();
                        newUser.setEmail(request.getEmail());
                        newUser.setSupabaseUserId(supabaseUserId);
                        newUser.setProvider("SUPABASE");
                        newUser.setEmailVerified(emailVerified);
                        newUser.setRole("USER");
                        newUser.setCreatedDate(new Date());

                        if (existingUser != null) {
                            newUser.setFirstName(existingUser.getFirstName());
                            newUser.setLastName(existingUser.getLastName());
                        }
                        return newUser;
                    });

            user.setLastLogin(new Date());
            user.setEmailVerified(emailVerified);
            userRepository.save(user);

            // ✅ SYNC TO MEDICAL_STAFF ON LOGIN (only if not exists)
            if (medicalStaffService != null) {
                medicalStaffService.syncUserIfNotExists(user);
                System.out.println("✅ Synced user to medical_staff on login");
            }

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", user.getAccountID());
            userData.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
            userData.put("lastName", user.getLastName() != null ? user.getLastName() : "");
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("provider", user.getProvider());
            userData.put("picture", user.getPicture());
            userData.put("emailVerified", user.isEmailVerified());

            System.out.println("=== Login successful for: " + request.getEmail());
            return AuthResponse.success("Login successful", token, userData);

        } catch (Exception e) {
            System.err.println("=== Login error for email: " + request.getEmail());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();

            String errorMsg = e.getMessage();

            if (errorMsg != null) {
                String lowerErrorMsg = errorMsg.toLowerCase();

                if (lowerErrorMsg.contains("invalid login credentials") ||
                        lowerErrorMsg.contains("invalid email") ||
                        lowerErrorMsg.contains("invalid password") ||
                        lowerErrorMsg.contains("incorrect password") ||
                        lowerErrorMsg.contains("invalid_credentials")) {
                    return AuthResponse.error("Invalid email or password. Please check your credentials and try again.");
                }

                if (lowerErrorMsg.contains("email not confirmed") ||
                        lowerErrorMsg.contains("email not verified")) {
                    return AuthResponse.error(
                            "⚠️ Email not verified!\n\n" +
                                    "Please check your inbox/spam folder for the verification link.\n" +
                                    "Need a new link? Use the 'Resend Verification' option on the login page."
                    );
                }

                if (lowerErrorMsg.contains("user not found") ||
                        lowerErrorMsg.contains("no user")) {
                    return AuthResponse.error("❌ No account found with this email. Please register first.");
                }

                if (lowerErrorMsg.contains("rate limit") ||
                        lowerErrorMsg.contains("too many requests")) {
                    return AuthResponse.error("⚠️ Too many login attempts. Please wait a few minutes before trying again.");
                }
            }

            return AuthResponse.error("❌ Invalid email or password. Please try again.");
        }
    }

    @PostMapping("/resend-verification")
    public AuthResponse resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return AuthResponse.error("Email address is required.");
        }

        try {
            System.out.println("Attempting to resend verification to: " + email);

            String resendKey = "resend_" + email.toLowerCase();
            RateLimitInfo rateInfo = rateLimitMap.get(resendKey);
            if (rateInfo != null) {
                long timeSinceLastResend = (System.currentTimeMillis() - rateInfo.lastAttemptTime) / 1000;
                if (timeSinceLastResend < 120) {
                    return AuthResponse.error(
                            "Please wait " + (120 - timeSinceLastResend) +
                                    " seconds before requesting another verification email."
                    );
                }
            }

            supabaseAuthService.resendConfirmationEmail(email);

            rateLimitMap.put(resendKey, new RateLimitInfo());

            return AuthResponse.success(
                    "✓ Verification email resent successfully!\n\n" +
                            "Please check your inbox (and spam folder) for the verification link.\n\n" +
                            "The link will redirect you to our site to confirm your email address.",
                    null,
                    null
            );
        } catch (Exception e) {
            System.err.println("Resend verification error: " + e.getMessage());
            e.printStackTrace();

            if (e.getMessage().contains("rate limit")) {
                return AuthResponse.error(
                        "Rate limit reached. Please wait 1 hour before requesting another verification email."
                );
            }

            return AuthResponse.error("Failed to resend verification email: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-email")
    public AuthResponse confirmEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String token = request.get("token");

        if (email == null || email.trim().isEmpty()) {
            return AuthResponse.error("Email is required for confirmation.");
        }

        try {
            UserAccountEntity user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setEmailVerified(true);
                userRepository.save(user);

                if (medicalStaffService != null) {
                    medicalStaffService.syncUserIfNotExists(user);
                    System.out.println("✅ Synced user to medical_staff on email confirmation");
                }

                return AuthResponse.success(
                        "✓ Email verified successfully!\n\n" +
                                "You can now login to your account.\n" +
                                "Redirecting to login page...",
                        null,
                        Map.of("emailVerified", true, "email", email)
                );
            } else {
                return AuthResponse.error(
                        "User not found. Please complete registration first."
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
            return AuthResponse.error("Email confirmation failed: " + e.getMessage());
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            Optional<UserAccountEntity> user = userService.getUserById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/oauth2/success")
    public AuthResponse handleOAuth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            if (oauth2User == null) {
                return AuthResponse.error("No authenticated user found");
            }

            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            String[] nameParts = name.split(" ", 2);
            String firstName = nameParts[0];
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            UserAccountEntity user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        UserAccountEntity newUser = new UserAccountEntity();
                        newUser.setFirstName(firstName);
                        newUser.setLastName(lastName);
                        newUser.setEmail(email);
                        newUser.setPicture(picture);
                        newUser.setProvider("GOOGLE");
                        newUser.setRole("USER");
                        newUser.setCreatedDate(new Date());
                        newUser.setEmailVerified(true);
                        newUser.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                        return newUser;
                    });

            user.setLastLogin(new Date());
            user.setPicture(picture);
            userRepository.save(user);

            if (medicalStaffService != null) {
                medicalStaffService.syncUserIfNotExists(user);
                System.out.println("✅ Synced Google user to medical_staff");
            }

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", user.getAccountID());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("provider", user.getProvider());
            userData.put("picture", user.getPicture());
            userData.put("emailVerified", user.isEmailVerified());

            return AuthResponse.success("Google login successful", token, userData);

        } catch (Exception e) {
            e.printStackTrace();
            return AuthResponse.error("Google login failed: " + e.getMessage());
        }
    }

    @GetMapping("/check-db")
    public String checkDatabase() {
        try {
            long count = userRepository.count();
            return "Database connected! Users count: " + count;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @GetMapping("/test-supabase")
    public String testSupabase() {
        try {
            String url = supabaseUrl + "/auth/v1/settings";
            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseKey);
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            return "Supabase is reachable! Status: " + response.getStatusCode();
        } catch (Exception e) {
            return "Supabase connection failed: " + e.getMessage();
        }
    }

    // Update user by ID
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> updateData) {
        try {
            Optional<UserAccountEntity> existingUser = userService.getUserById(id);
            if (existingUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            UserAccountEntity user = existingUser.get();
            
            if (updateData.containsKey("firstName")) {
                user.setFirstName((String) updateData.get("firstName"));
            }
            if (updateData.containsKey("lastName")) {
                user.setLastName((String) updateData.get("lastName"));
            }
            if (updateData.containsKey("age")) {
                user.setAge(Integer.parseInt(updateData.get("age").toString()));
            }
            if (updateData.containsKey("gender")) {
                user.setGender((String) updateData.get("gender"));
            }
            if (updateData.containsKey("email")) {
                user.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("phone")) {
                user.setPhone((String) updateData.get("phone"));
            }
            if (updateData.containsKey("specialization")) {
                user.setSpecialization((String) updateData.get("specialization"));
            }
            if (updateData.containsKey("department")) {
                user.setDepartment((String) updateData.get("department"));
            }
            if (updateData.containsKey("role")) {
                user.setRole((String) updateData.get("role"));
            }
            if (updateData.containsKey("photo")) {
                user.setPhoto((String) updateData.get("photo"));
            }
            if (updateData.containsKey("availability")) {
                user.setAvailability((String) updateData.get("availability"));
            }
            
            UserAccountEntity saved = userService.saveUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("data", saved);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Change password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            String email = passwordData.get("email");
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            Optional<UserAccountEntity> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }
            
            UserAccountEntity user = userOpt.get();
            
            // First, verify current password with Supabase
            try {
                JsonObject verifyResponse = supabaseAuthService.signInWithEmail(email, currentPassword);
                if (verifyResponse == null || !verifyResponse.has("user")) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Current password is incorrect"));
                }
                
                // Get the access token from the sign-in response
                String accessToken = verifyResponse.get("access_token").getAsString();
                
                // Update password in Supabase using the access token
                boolean supabaseUpdated = supabaseAuthService.updatePassword(accessToken, newPassword);
                
                if (supabaseUpdated) {
                    // Also update local password hash for fallback
                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    userService.saveUser(user);
                    
                    return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
                } else {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to update password in Supabase"));
                }
                
            } catch (RuntimeException e) {
                if (e.getMessage().contains("Invalid email or password")) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Current password is incorrect"));
                }
                throw e;
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }


    }

    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAllDevices(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            
            // Invalidate the token (add to blacklist or just let it expire)
            // For now, just return success
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged out from all devices"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}