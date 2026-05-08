package edu.cit.aloria.clinicaflow.features.authentication;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user_account")
public class UserAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountid")
    private Integer accountID;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "role", length = 50)
    private String role;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "supabase_user_id", length = 255)
    private String supabaseUserId;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "last_login")
    private Date lastLogin;

    @Column(name = "picture", length = 500)
    private String picture;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "specialization", length = 100)
    private String specialization;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "availability", length = 20)
    private String availability;

    @Column(name = "photo", length = 1000)
    private String photo;

    // ADD THESE MISSING FIELDS
    @Column(name = "contact_no", length = 20)
    private String contactNo;

    @Column(name = "specialty", length = 100)
    private String specialty;

    // Getters and Setters - ADD THESE

    public Integer getAccountID() {
        return accountID;
    }

    public void setAccountID(Integer accountID) {
        this.accountID = accountID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getSupabaseUserId() {
        return supabaseUserId;
    }

    public void setSupabaseUserId(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    // ADD THESE GETTERS AND SETTERS
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
}