package edu.cit.aloria.clinicaflow.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "medical_staff")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MedicalStaffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private int staffID;

    @Column(name = "fname", nullable = false, length = 50)
    private String fname;

    @Column(name = "lname", nullable = false, length = 50)
    private String lname;

    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @Column(name = "contact_no", length = 20)
    private String contactNo;

    @Column(name = "specialty", length = 100)
    private String specialty;

    @Column(name = "availability", length = 20)
    private String availability = "Available";  // ADD THIS FIELD

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id", referencedColumnName = "accountid")
    private UserAccountEntity userAccount;

    // Constructors
    public MedicalStaffEntity() {}

    public MedicalStaffEntity(String fname, String lname, String role, String contactNo, String specialty) {
        this.fname = fname;
        this.lname = lname;
        this.role = role;
        this.contactNo = contactNo;
        this.specialty = specialty;
        this.availability = "Available";
    }

    // Getters and Setters
    public int getStaffID() {
        return staffID;
    }

    public void setStaffID(int staffID) {
        this.staffID = staffID;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    // ADD THIS GETTER AND SETTER
    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public UserAccountEntity getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccountEntity userAccount) {
        this.userAccount = userAccount;
    }

    // Helper method to get full name
    public String getFullName() {
        return fname + " " + lname;
    }

    @Override
    public String toString() {
        return "MedicalStaffEntity{" +
                "staffID=" + staffID +
                ", fname='" + fname + '\'' +
                ", lname='" + lname + '\'' +
                ", role='" + role + '\'' +
                ", contactNo='" + contactNo + '\'' +
                ", specialty='" + specialty + '\'' +
                ", availability='" + availability + '\'' +
                '}';
    }
}