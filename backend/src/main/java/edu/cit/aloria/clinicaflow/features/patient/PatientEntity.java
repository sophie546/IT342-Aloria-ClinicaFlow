package edu.cit.aloria.clinicaflow.features.patient;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class PatientEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PatientID")
    private String patientId;
    
    @Column(name = "fname", nullable = false)  // Changed to lowercase
    private String fname;
    
    @Column(name = "lname", nullable = false)  // Changed to lowercase
    private String lname;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(nullable = false)
    private String gender;
    
    @Column(name = "contactno", nullable = false)  // Changed to lowercase
    private String contactNo;
    
    @Column(name = "address", nullable = false)  // Changed to lowercase
    private String address;
    
    @Column(name = "queue_number")
    private Integer queueNumber;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "assigned_doctor")
    private String assignedDoctor;
    
    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Transient
    private Long queuePosition;
    
    @Transient
    private Integer estimatedWaitTime;
    
    // Getters and Setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }
    
    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAssignedDoctor() { return assignedDoctor; }
    public void setAssignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; }
    
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getQueuePosition() { return queuePosition; }
    public void setQueuePosition(Long queuePosition) { this.queuePosition = queuePosition; }
    
    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "waiting";
        if (assignedDoctor == null) assignedDoctor = "Dr. Cruz";
        if (arrivalTime == null) arrivalTime = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}