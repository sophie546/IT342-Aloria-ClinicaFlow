package edu.cit.aloria.clinicaflow.features.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    @Autowired
    private UserAccountRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Get the user from Google
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        
        System.out.println("=== OAuth2 Login Attempt ===");
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        
        String[] nameParts = name.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        
        try {
            // Check if user exists, if not create new user
            UserAccountEntity user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        System.out.println("Creating new user: " + email);
                        UserAccountEntity newUser = new UserAccountEntity();
                        newUser.setFirstName(firstName);
                        newUser.setLastName(lastName);
                        newUser.setEmail(email);
                        newUser.setPicture(picture);
                        newUser.setProvider("GOOGLE");
                        newUser.setRole("PATIENT");
                        newUser.setCreatedDate(new Date());
                        newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                        // REMOVED: setEnabled and setVerified since they don't exist
                        return userRepository.save(newUser);
                    });
            
            // Update last login and picture
            user.setLastLogin(new Date());
            user.setPicture(picture);
            userRepository.save(user);
            
            System.out.println("✅ OAuth2 Login Successful for: " + email);
            
            // Create authorities/roles
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
            
            // Return OAuth2User with authorities
            return new DefaultOAuth2User(authorities, attributes, "email");
            
        } catch (Exception e) {
            System.out.println("❌ OAuth2 Login Error: " + e.getMessage());
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Error processing Google login: " + e.getMessage());
        }
    }
}