package edu.cit.aloria.clinicaflow.features.patient;

import java.time.LocalDateTime;
import java.util.List;

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
        patient.setLname(request.getLastName());  // Note: setLname not setLastName
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
    
    public List<PatientEntity> getCurrentQueue() {
        return patientRepository.findWaitingQueue();
    }

    
}