package edu.cit.aloria.clinicaflow.features.authentication;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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
        headers.set("Authorization", "Bearer " + supabaseKey);
        
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        body.addProperty("password", password);
        body.addProperty("email_confirm", true);
        
        JsonObject userData = new JsonObject();
        userData.addProperty("first_name", firstName);
        userData.addProperty("last_name", lastName);
        body.add("data", userData);
        
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        
        try {
            System.out.println("Sending signup request to Supabase for: " + email);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Supabase response status: " + response.getStatusCode());
            System.out.println("Supabase response body: " + response.getBody());
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                
                if (jsonResponse.has("user")) {
                    JsonObject user = jsonResponse.getAsJsonObject("user");
                    if (user.has("email_confirmed_at") && !user.get("email_confirmed_at").isJsonNull()) {
                        System.out.println("Email already confirmed for: " + email);
                    } else {
                        System.out.println("Verification email should have been sent to: " + email);
                    }
                }
                
                return jsonResponse;
            } else {
                JsonObject errorResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String errorMsg = parseErrorMessage(errorResponse);
                System.err.println("Supabase error: " + errorMsg);
                throw new RuntimeException(errorMsg);
            }
        } catch (HttpClientErrorException e) {
            System.err.println("HTTP Error during signup: " + e.getStatusCode());
            try {
                String errorBody = e.getResponseBodyAsString();
                System.err.println("Error body: " + errorBody);
                JsonObject errorResponse = JsonParser.parseString(errorBody).getAsJsonObject();
                String errorMsg = parseErrorMessage(errorResponse);
                throw new RuntimeException(errorMsg);
            } catch (Exception parseEx) {
                throw new RuntimeException("Registration failed: " + e.getMessage());
            }
        } catch (RestClientException e) {
            System.err.println("RestClientException: " + e.getMessage());
            e.printStackTrace();
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
            return JsonParser.parseString(response.getBody()).getAsJsonObject();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new RuntimeException("Invalid email or password");
            }
            throw new RuntimeException(e.getResponseBodyAsString());
        }
    }
    
    public void resendConfirmationEmail(String email) {
        String url = supabaseUrl + "/auth/v1/recover";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        
        try {
            System.out.println("Resending verification email to: " + email);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Resend response status: " + response.getStatusCode());
            System.out.println("Resend response body: " + response.getBody());
            
            if (response.getStatusCode() != HttpStatus.OK) {
                JsonObject errorResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String errorMsg = parseErrorMessage(errorResponse);
                throw new RuntimeException(errorMsg);
            }
        } catch (RestClientException e) {
            System.err.println("Resend error: " + e.getMessage());
            throw new RuntimeException("Unable to send verification email. Please try again later.");
        }
    }
        
    private String parseErrorMessage(JsonObject errorResponse) {
        if (errorResponse.has("msg")) {
            String errorMsg = errorResponse.get("msg").getAsString();
            
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
        } else if (errorResponse.has("error")) {
            return errorResponse.get("error").getAsString();
        }
        
        return "Registration failed. Please check your information and try again.";
    }
    
    private String parseLoginErrorMessage(JsonObject errorResponse) {
        // Check for error field (common in Supabase error responses)
        if (errorResponse.has("error")) {
            String error = errorResponse.get("error").getAsString();
            if (error.contains("invalid_credentials") || error.contains("Invalid login credentials")) {
                return "Invalid email or password. Please check your credentials and try again.";
            }
        }
        
        // Check for msg field
        if (errorResponse.has("msg")) {
            String errorMsg = errorResponse.get("msg").getAsString();
            
            if (errorMsg.contains("Invalid login credentials")) {
                return "Invalid email or password. Please check your credentials and try again.";
            } else if (errorMsg.contains("Email not confirmed")) {
                return "Please verify your email address first. Check your inbox for the verification link.";
            } else if (errorMsg.contains("rate limit")) {
                return "Too many login attempts. Please wait a few minutes before trying again.";
            } else if (errorMsg.contains("user not found")) {
                return "No account found with this email. Please register first.";
            }
            
            return errorMsg;
        }
        
        // Check for error_description field
        if (errorResponse.has("error_description")) {
            String errorDesc = errorResponse.get("error_description").getAsString();
            if (errorDesc.contains("Invalid login credentials")) {
                return "Invalid email or password. Please try again.";
            }
            return errorDesc;
        }
        
        // Check for message field
        if (errorResponse.has("message")) {
            String message = errorResponse.get("message").getAsString();
            if (message.contains("Invalid login credentials")) {
                return "Invalid email or password. Please try again.";
            }
            return message;
        }
        
        // Check for code field (Supabase sometimes uses this)
        if (errorResponse.has("code")) {
            String code = errorResponse.get("code").getAsString();
            if (code.equals("401") || code.equals("invalid_credentials")) {
                return "Invalid email or password. Please check your credentials and try again.";
            }
        }
        
        return "Login failed. Please check your email and password.";
    }
}
