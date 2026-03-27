import java.util.HashMap;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import edu.cit.aloria.clinicaflow.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;

package edu.cit.aloria.clinicaflow.controller;

import edu.cit.aloria.clinicaflow.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.dto.request.LoginRequest;
import edu.cit.aloria.clinicaflow.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.repository.UserAccountRepository;
import edu.cit.aloria.clinicaflow.service.JwtService;
import edu.cit.aloria.clinicaflow.service.SupabaseAuthService;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;

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
    
    @PostMapping("/register")
public AuthResponse register(@RequestBody RegisterRequest request) {
    try {
        System.out.println("=== Starting registration for: " + request.getEmail());
        
        // Validate input
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
        
        // Check if email already exists in local database
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return AuthResponse.error("This email is already registered. Please login instead.");
        }
        
        // Register with Supabase
        JsonObject supabaseResponse = supabaseAuthService.signUpWithEmail(
            request.getEmail(),
            request.getPassword(),
            request.getFirstName(),
            request.getLastName()
        );
        
        // Extract user data
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
        
        // Create user in local database
        UserAccountEntity user = new UserAccountEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setProvider("SUPABASE");
        user.setSupabaseUserId(supabaseUserId);
        user.setEmailVerified(emailVerified);
        user.setCreatedDate(new Date());
        user.setLastLogin(new Date());
        
        UserAccountEntity savedUser = userRepository.save(user);
        
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
            "If you don't see the email, please check your spam folder.";
        
        return AuthResponse.success(message, null, userData);
        
    } catch (Exception e) {
        String errorMessage = e.getMessage();
        
        // Return user-friendly error messages
        if (errorMessage.contains("rate limit") || errorMessage.contains("Too many registration attempts")) {
            return AuthResponse.error(
                "Too many registration attempts.\n\n" +
                "Please wait 1 hour before trying again, or use a different email address.\n" +
                "This helps protect against spam and abuse."
            );
        } else if (errorMessage.contains("already registered")) {
            return AuthResponse.error(
                "This email is already registered.\n\n" +
                "If you already have an account, please login instead.\n" +
                "If you forgot your password, use the 'Forgot Password' option."
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
            return AuthResponse.error(
                "Registration failed.\n\n" +
                "Please check your information and try again.\n" +
                "If the problem persists, please contact support."
            );
        }
    }
}
    
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            // First check if user exists locally
            UserAccountEntity existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);
            
            if (existingUser != null && "GOOGLE".equals(existingUser.getProvider())) {
                return AuthResponse.error("Please use Google login for this account");
            }
            
            // Login with Supabase Auth
            JsonObject supabaseResponse = supabaseAuthService.signInWithEmail(
                request.getEmail(),
                request.getPassword()
            );
            
            JsonObject userObj = supabaseResponse.getAsJsonObject("user");
            String supabaseUserId = userObj.get("id").getAsString();
            boolean emailVerified = userObj.has("email_confirmed_at") && 
                                    !userObj.get("email_confirmed_at").isJsonNull();
            
            if (!emailVerified) {
                return AuthResponse.error("Please verify your email before logging in. Check your inbox for the verification link.");
            }
            
            // Find user in local database
            UserAccountEntity user = userRepository.findBySupabaseUserId(supabaseUserId)
                .orElseGet(() -> {
                    // Create user if doesn't exist (shouldn't happen, but just in case)
                    UserAccountEntity newUser = new UserAccountEntity();
                    newUser.setEmail(request.getEmail());
                    newUser.setSupabaseUserId(supabaseUserId);
                    newUser.setProvider("SUPABASE");
                    newUser.setEmailVerified(emailVerified);
                    newUser.setRole("USER");
                    newUser.setCreatedDate(new Date());
                    return newUser;
                });
            
            user.setLastLogin(new Date());
            user.setEmailVerified(emailVerified);
            userRepository.save(user);
            
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
            
            return AuthResponse.success("Login successful", token, userData);
            
        } catch (Exception e) {
            e.printStackTrace();
            return AuthResponse.error("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/resend-verification")
    public AuthResponse resendVerification(@RequestParam String email) {
        try {
            supabaseAuthService.resendConfirmationEmail(email);
            return AuthResponse.success("Verification email resent successfully. Please check your inbox.", null, null);
        } catch (Exception e) {
            return AuthResponse.error("Failed to resend verification email: " + e.getMessage());
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
        // Simple test to check if Supabase is reachable
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
}