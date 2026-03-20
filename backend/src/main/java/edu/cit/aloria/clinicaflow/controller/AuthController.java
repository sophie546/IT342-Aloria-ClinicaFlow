package edu.cit.aloria.clinicaflow.controller;

import edu.cit.aloria.clinicaflow.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.dto.request.LoginRequest;
import edu.cit.aloria.clinicaflow.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.repository.UserAccountRepository;
import edu.cit.aloria.clinicaflow.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return AuthResponse.error("Email already exists");
            }
            
            // Create new user
            UserAccountEntity user = new UserAccountEntity();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            user.setProvider("LOCAL");
            user.setCreatedDate(new Date());
            user.setLastLogin(new Date());
            
            // Save user
            UserAccountEntity savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtService.generateToken(savedUser.getEmail());
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", savedUser.getAccountID());
            userData.put("firstName", savedUser.getFirstName());
            userData.put("lastName", savedUser.getLastName());
            userData.put("email", savedUser.getEmail());
            userData.put("role", savedUser.getRole());
            userData.put("provider", savedUser.getProvider());
            userData.put("picture", savedUser.getPicture());
            
            // Return success response with token
            return AuthResponse.success(
                "User registered successfully", 
                token,
                userData
            );
            
        } catch (Exception e) {
            return AuthResponse.error("Registration failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            // Find user by email
            UserAccountEntity user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
            
            if (user == null) {
                return AuthResponse.error("User not found with this email");
            }
            
            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return AuthResponse.error("Invalid password");
            }
            
            // Update last login
            user.setLastLogin(new Date());
            userRepository.save(user);
            
            // Generate JWT token
            String token = jwtService.generateToken(user.getEmail());
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", user.getAccountID());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("provider", user.getProvider());
            userData.put("picture", user.getPicture());
            
            // Return success response with token
            return AuthResponse.success(
                "Login successful", 
                token,
                userData
            );
            
        } catch (Exception e) {
            return AuthResponse.error("Login failed: " + e.getMessage());
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
            
            // Split full name into first and last name
            String[] nameParts = name.split(" ", 2);
            String firstName = nameParts[0];
            String lastName = nameParts.length > 1 ? nameParts[1] : "";
            
            // Find or create user
            UserAccountEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserAccountEntity newUser = new UserAccountEntity();
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);
                    newUser.setEmail(email);
                    newUser.setPicture(picture);
                    newUser.setProvider("GOOGLE");
                    newUser.setRole("USER"); // Default role
                    newUser.setCreatedDate(new Date());
                    newUser.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    return newUser;
                });
            
            // Update last login and picture
            user.setLastLogin(new Date());
            user.setPicture(picture); // Update picture in case it changed
            userRepository.save(user);
            
            // Generate JWT token
            String token = jwtService.generateToken(user.getEmail());
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", user.getAccountID());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("provider", user.getProvider());
            userData.put("picture", user.getPicture());
            
            return AuthResponse.success(
                "Google login successful",
                token,
                userData
            );
            
        } catch (Exception e) {
            return AuthResponse.error("Google login failed: " + e.getMessage());
        }
    }
}