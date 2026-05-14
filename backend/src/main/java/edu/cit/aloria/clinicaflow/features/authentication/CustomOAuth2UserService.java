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
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffRepository;

import java.util.*;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    @Autowired
    private UserAccountRepository userRepository;
    
    @Autowired
    private MedicalStaffRepository medicalStaffRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // List of allowed staff/doctor emails
    private static final Set<String> STAFF_EMAILS = Set.of(
        "sophie.aloria@gmail.com",
        "doctor@example.com",
        "nurse@example.com"
    );

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
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
            // Determine role based on email
            String role = STAFF_EMAILS.contains(email) ? "DOCTOR" : "PATIENT";
            System.out.println("Assigned role: " + role);
            
            // SAFE: Use findFirstByEmail to avoid NonUniqueResultException
            Optional<UserAccountEntity> existingUser = userRepository.findFirstByEmail(email);
            
            UserAccountEntity user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                System.out.println("Found existing user: " + email);
                
                // Check for and remove duplicates
                List<UserAccountEntity> duplicates = userRepository.findAllByEmail(email);
                if (duplicates.size() > 1) {
                    System.out.println("Found " + duplicates.size() + " duplicates for email: " + email);
                    for (int i = 0; i < duplicates.size(); i++) {
                        UserAccountEntity dup = duplicates.get(i);
                        if (!dup.getAccountID().equals(user.getAccountID())) {
                            System.out.println("Deleting duplicate user with ID: " + dup.getAccountID());
                            userRepository.delete(dup);
                        }
                    }
                }
            } else {
                System.out.println("Creating new user: " + email);
                user = new UserAccountEntity();
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email);
                user.setPicture(picture);
                user.setProvider("GOOGLE");
                user.setRole(role);
                user.setCreatedDate(new Date());
                user.setEmailVerified(true);
                user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                user = userRepository.save(user);
            }
            
            // Update last login and picture
            user.setLastLogin(new Date());
            user.setPicture(picture);
            userRepository.save(user);
            
            // If role is DOCTOR, create/update medical_staff record
            if ("DOCTOR".equals(role)) {
                Optional<MedicalStaffEntity> existingStaff = medicalStaffRepository.findByEmail(email);
                if (existingStaff.isEmpty()) {
                    System.out.println("Creating medical_staff record for: " + email);
                    MedicalStaffEntity newStaff = new MedicalStaffEntity();
                    newStaff.setFname(firstName);
                    newStaff.setLname(lastName);
                    newStaff.setEmail(email);
                    newStaff.setRole("Doctor");
                    newStaff.setSpecialty("General Medicine");
                    newStaff.setContactNo("Not provided");
                    newStaff.setAvailability("Available");
                    newStaff.setUserAccount(user);
                    medicalStaffRepository.save(newStaff);
                    System.out.println("✅ Medical staff record created");
                }
            }
            
            System.out.println("✅ OAuth2 Login Successful for: " + email);
            
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            
            return new DefaultOAuth2User(authorities, attributes, "email");
            
        } catch (Exception e) {
            System.out.println("❌ OAuth2 Login Error: " + e.getMessage());
            e.printStackTrace();
            throw new OAuth2AuthenticationException("Error processing Google login: " + e.getMessage());
        }
    }
}