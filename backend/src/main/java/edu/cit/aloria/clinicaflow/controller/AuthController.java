package edu.cit.aloria.clinicaflow.controller;

import edu.cit.aloria.clinicaflow.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.dto.request.LoginRequest;
import edu.cit.aloria.clinicaflow.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserAccountRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
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
            user.setEmail(request.getEmail());  // Using email
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            
            // Save user
            UserAccountEntity savedUser = userRepository.save(user);
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", savedUser.getAccountID());
            userData.put("firstName", savedUser.getFirstName());
            userData.put("lastName", savedUser.getLastName());
            userData.put("email", savedUser.getEmail());
            userData.put("role", savedUser.getRole());
            
            // Return success response
            return AuthResponse.success(
                "User registered successfully", 
                null,
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
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("accountID", user.getAccountID());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            
            // Return success response
            return AuthResponse.success(
                "Login successful", 
                null,
                userData
            );
            
        } catch (Exception e) {
            return AuthResponse.error("Login failed: " + e.getMessage());
        }
    }
}