package edu.cit.aloria.clinicaflow.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class SupabaseAuthService {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.key}")
    private String supabaseKey;
    
    private final RestTemplate restTemplate;
    
    public SupabaseAuthService() {
        this.restTemplate = new RestTemplate();
    }
    
    public JsonObject signUpWithEmail(String email, String password, String firstName, String lastName) {
        String url = supabaseUrl + "/auth/v1/signup";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        body.addProperty("password", password);
        
        JsonObject userData = new JsonObject();
        userData.addProperty("first_name", firstName);
        userData.addProperty("last_name", lastName);
        body.add("data", userData);
        
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return JsonParser.parseString(response.getBody()).getAsJsonObject();
            } else {
                // Parse error response
                JsonObject errorResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String errorMsg = parseErrorMessage(errorResponse);
                throw new RuntimeException(errorMsg);
            }
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to connect to authentication service. Please try again later.");
        }
    }
    
    public JsonObject signInWithEmail(String email, String password) {
        String url = supabaseUrl + "/auth/v1/token?grant_type=password";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        body.addProperty("password", password);
        
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return JsonParser.parseString(response.getBody()).getAsJsonObject();
            } else {
                JsonObject errorResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String errorMsg = parseLoginErrorMessage(errorResponse);
                throw new RuntimeException(errorMsg);
            }
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to connect to authentication service. Please try again later.");
        }
    }
    
    public void resendConfirmationEmail(String email) {
        String url = supabaseUrl + "/auth/v1/resend";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        body.addProperty("type", "signup");
        
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() != HttpStatus.OK) {
                JsonObject errorResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String errorMsg = parseErrorMessage(errorResponse);
                throw new RuntimeException(errorMsg);
            }
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to send verification email. Please try again later.");
        }
    }
    
    private String parseErrorMessage(JsonObject errorResponse) {
        if (errorResponse.has("msg")) {
            String errorMsg = errorResponse.get("msg").getAsString();
            
            // Convert technical errors to user-friendly messages
            if (errorMsg.contains("rate limit")) {
                return "Too many registration attempts. Please wait 1 hour before trying again, or use a different email address.";
            } else if (errorMsg.contains("already registered")) {
                return "This email is already registered. Please login instead or use a different email address.";
            } else if (errorMsg.contains("password")) {
                return "Password must be at least 6 characters long.";
            } else if (errorMsg.contains("email")) {
                return "Please enter a valid email address.";
            }
            
            return errorMsg;
        } else if (errorResponse.has("error_description")) {
            return errorResponse.get("error_description").getAsString();
        } else if (errorResponse.has("message")) {
            return errorResponse.get("message").getAsString();
        }
        
        return "Registration failed. Please check your information and try again.";
    }
    
    private String parseLoginErrorMessage(JsonObject errorResponse) {
        if (errorResponse.has("msg")) {
            String errorMsg = errorResponse.get("msg").getAsString();
            
            if (errorMsg.contains("Invalid login credentials")) {
                return "Invalid email or password. Please check your credentials and try again.";
            } else if (errorMsg.contains("Email not confirmed")) {
                return "Please verify your email address first. Check your inbox for the verification link.";
            }
            
            return errorMsg;
        } else if (errorResponse.has("error_description")) {
            return errorResponse.get("error_description").getAsString();
        }
        
        return "Login failed. Please check your email and password.";
    }
}