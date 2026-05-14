package edu.cit.aloria.clinicaflow.shared.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import edu.cit.aloria.clinicaflow.features.authentication.CustomOAuth2UserService;
import edu.cit.aloria.clinicaflow.features.authentication.JwtAuthenticationFilter;
import edu.cit.aloria.clinicaflow.features.authentication.OAuth2LoginSuccessHandler;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    @Order(1)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**")
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/api/patient/register-queue",
                    "/api/patient/queue-status",
                    "/api/patient/queue",
                    "/api/patient/test"
                ).permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/patient/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/patient/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/patient/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/patient/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions
                .defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    new AntPathRequestMatcher("/api/**")
                )
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/oauth2/**", "/login/**")
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(oAuth2LoginSuccessHandler)
                .failureHandler((request, response, exception) -> {
                    System.out.println("❌ OAuth2 Failure: " + exception.getMessage());
                    response.sendRedirect("http://localhost:5173/login?error=true&message=" + exception.getMessage());
                })
            );
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000", 
            "http://localhost:5173",
            "http://localhost:5174"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}