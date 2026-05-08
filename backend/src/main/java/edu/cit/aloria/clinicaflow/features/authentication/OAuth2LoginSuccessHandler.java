package edu.cit.aloria.clinicaflow.features.authentication;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        
        System.out.println("=== OAuth2 Success Handler ===");
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        
        // Generate JWT token
        String token = jwtService.generateToken(email);
        System.out.println("Generated Token: " + token);
        
        // Build redirect URL with token as query parameter
        String redirectUrl = "http://localhost:5173/oauth2/redirect?" +
            "token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) +
            "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8) +
            "&name=" + URLEncoder.encode(name != null ? name : "", StandardCharsets.UTF_8) +
            "&picture=" + URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8);
        
        System.out.println("Redirecting to: " + redirectUrl);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}