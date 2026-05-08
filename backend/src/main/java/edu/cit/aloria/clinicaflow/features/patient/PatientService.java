package edu.cit.aloria.clinicaflow.features.patient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.aloria.clinicaflow.features.authentication.dto.PatientRegistrationRequest;

@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public PatientEntity registerToQueue(PatientRegistrationRequest request) {
        PatientEntity patient = new PatientEntity();
        patient.setFname(request.getFirstName());
        patient.setLname(request.getLastName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setContactNo(request.getContactNumber());
        patient.setAddress(request.getAddress());
        patient.setStatus("waiting");
        patient.setAssignedDoctor("Dr. Cruz");
        patient.setArrivalTime(LocalDateTime.now());
        
        // Generate sequential queue number for today
        Integer lastQueueNumber = patientRepository.findMaxQueueNumberForToday();
        int queueNumber = (lastQueueNumber == null) ? 1 : lastQueueNumber + 1;
        patient.setQueueNumber(queueNumber);
        
        PatientEntity savedPatient = patientRepository.save(patient);
        
        // Calculate queue position
        Long position = patientRepository.countByStatusAndCreatedAtBefore("waiting", savedPatient.getCreatedAt());
        savedPatient.setQueuePosition(position + 1);
        
        // Estimate wait time (15 minutes per patient)
        savedPatient.setEstimatedWaitTime((int) ((position) * 15));
        
        return savedPatient;
    }
    
    public Long getQueueLength() {
        return patientRepository.countByStatus("waiting");
    }
    
    public Integer getEstimatedWaitTime() {
        Long queueLength = getQueueLength();
        return (int) (queueLength * 15);
    }
    
    // Get active queue (waiting and consulting)
    public List<PatientEntity> getCurrentQueue() {
        return patientRepository.findWaitingPatientsOnly();
    }
    
    // Get ALL patients for records
    public List<PatientEntity> getAllPatients() {
        return patientRepository.findAllPatientsOrdered();
    }

    // Update patient
    public PatientEntity updatePatient(String id, Map<String, Object> updateData) throws Exception {
        Optional<PatientEntity> optional = patientRepository.findById(id);
        if (optional.isEmpty()) {
            throw new Exception("Patient not found with id: " + id);
        }
        
        PatientEntity patient = optional.get();
        
        if (updateData.containsKey("fname")) {
            patient.setFname((String) updateData.get("fname"));
        }
        if (updateData.containsKey("lname")) {
            patient.setLname((String) updateData.get("lname"));
        }
        if (updateData.containsKey("age")) {
            Object ageValue = updateData.get("age");
            if (ageValue instanceof Integer) {
                patient.setAge((Integer) ageValue);
            } else if (ageValue instanceof String) {
                patient.setAge(Integer.parseInt((String) ageValue));
            }
        }
        if (updateData.containsKey("status")) {
            patient.setStatus((String) updateData.get("status"));
        }
        if (updateData.containsKey("assignedDoctor")) {
            patient.setAssignedDoctor((String) updateData.get("assignedDoctor"));
        }
        
        return patientRepository.save(patient);
    }

    // PERMANENT DELETE (use carefully)
    public void deletePatient(String id) throws Exception {
        Optional<PatientEntity> optional = patientRepository.findById(id);
        if (optional.isEmpty()) {
            throw new Exception("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
        System.out.println("⚠️ Patient permanently deleted: " + id);
    }

    // Update patient status (used for removing from queue)
    public PatientEntity updatePatientStatus(String id, String status, String assignedDoctor) throws Exception {
        Optional<PatientEntity> optional = patientRepository.findById(id);
        if (optional.isEmpty()) {
            throw new Exception("Patient not found with id: " + id);
        }
        
        PatientEntity patient = optional.get();
        patient.setStatus(status);
        if (assignedDoctor != null && !assignedDoctor.isEmpty()) {
            patient.setAssignedDoctor(assignedDoctor);
        }
        
        return patientRepository.save(patient);
    }
}