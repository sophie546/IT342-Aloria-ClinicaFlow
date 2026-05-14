package edu.cit.aloria.clinicaflow.features.authentication.dto;

public class PatientRegistrationRequest {
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private String contactNumber;
    private String address;
    
    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}