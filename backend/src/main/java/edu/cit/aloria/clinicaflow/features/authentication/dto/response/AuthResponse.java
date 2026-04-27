package edu.cit.aloria.clinicaflow.features.authentication.dto.response;

import java.util.Map;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private Map<String, Object> user;

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, String token, Map<String, Object> user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }

    // Helper methods
    public static AuthResponse success(String message, String token, Map<String, Object> user) {
        return new AuthResponse(true, message, token, user);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null, null);
    }

    // toString for debugging
    @Override
    public String toString() {
        return "AuthResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", user=" + user +
                '}';
    }
}
