package edu.cit.aloria.clinicaflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "user_account")
public class UserAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountID;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    @OneToOne(mappedBy = "userAccount", cascade = CascadeType.ALL)
    @JsonIgnore
    // private MedicalStaffEntity medicalStaff;

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    /*
     * public MedicalStaffEntity getMedicalStaff() {
     * return medicalStaff;
     * }
     * 
     * public void setMedicalStaff(MedicalStaffEntity medicalStaff) {
     * this.medicalStaff = medicalStaff;
     * }
     */
}