package edu.cit.aloria.clinicaflow.features.patient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.cit.aloria.clinicaflow.features.authentication.dto.PatientRegistrationRequest;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @PostMapping("/register-queue")
    public ResponseEntity<?> registerToQueue(@RequestBody PatientRegistrationRequest request) {
        try {
            // Validate required fields
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return badRequest("First name is required");
            }
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                return badRequest("Last name is required");
            }
            if (request.getAge() == null || request.getAge() < 1 || request.getAge() > 150) {
                return badRequest("Valid age is required (1-150)");
            }
            if (request.getGender() == null || request.getGender().trim().isEmpty()) {
                return badRequest("Gender is required");
            }
            if (request.getContactNumber() == null || request.getContactNumber().trim().isEmpty()) {
                return badRequest("Contact number is required");
            }
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                return badRequest("Address is required");
            }
            
            PatientEntity patient = patientService.registerToQueue(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully registered to queue");
            response.put("queueNumber", patient.getQueueNumber());
            response.put("queuePosition", patient.getQueuePosition());
            response.put("estimatedWaitTime", patient.getEstimatedWaitTime());
            response.put("assignedDoctor", patient.getAssignedDoctor());
            response.put("data", patient);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to register: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/queue-status")
    public ResponseEntity<?> getQueueStatus() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queueLength", patientService.getQueueLength());
            response.put("estimatedWaitTime", patientService.getEstimatedWaitTime());
            response.put("currentQueue", patientService.getCurrentQueue());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Patient API is working!");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
    
    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @GetMapping("/queue")
    public ResponseEntity<?> getQueue() {
        try {
            List<PatientEntity> queue = patientService.getCurrentQueue();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", queue);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}