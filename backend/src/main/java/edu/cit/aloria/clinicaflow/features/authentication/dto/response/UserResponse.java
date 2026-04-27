package edu.cit.aloria.clinicaflow.features.authentication.dto.response;

import java.util.Map;

public class UserResponse {
    private Long id;
    private String email;
    private String role;
    private Map<String, Object> medicalStaff;

    // Constructors
    public UserResponse() {
    }

    public UserResponse(Long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Map<String, Object> getMedicalStaff() {
        return medicalStaff;
    }

    public void setMedicalStaff(Map<String, Object> medicalStaff) {
        this.medicalStaff = medicalStaff;
    }
}
