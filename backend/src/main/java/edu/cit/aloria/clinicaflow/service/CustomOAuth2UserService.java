package edu.cit.aloria.clinicaflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.repository.UserAccountRepository;
import java.util.Date;
import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    
    @Autowired
    private UserAccountRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private final DefaultOAuth2UserService defaultService = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = defaultService.loadUser(userRequest);
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        
        // Split full name into first and last name
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
                    newUser.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    return newUser;
                });
        
        user.setLastLogin(new Date());
        user.setPicture(picture);
        userRepository.save(user);
        
        return oauth2User;
    }
}