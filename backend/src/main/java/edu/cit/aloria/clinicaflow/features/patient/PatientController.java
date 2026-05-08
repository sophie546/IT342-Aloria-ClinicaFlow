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
    
    // ENDPOINT FOR ACTIVE QUEUE (waiting + consulting only)
    @GetMapping("/queue")
    public ResponseEntity<?> getActiveQueue() {
        try {
            // Only return patients with status 'waiting' or 'consulting'
            List<PatientEntity> activeQueue = patientService.getCurrentQueue();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activeQueue);
            System.out.println("📊 Returning " + activeQueue.size() + " active queue patients to frontend");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // NEW ENDPOINT FOR ALL PATIENTS (for Patient Records page)
    @GetMapping("/all")
    public ResponseEntity<?> getAllPatients() {
        try {
            // Return ALL patients including completed
            List<PatientEntity> allPatients = patientService.getAllPatients();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", allPatients);
            System.out.println("📊 Returning " + allPatients.size() + " total patients to records page");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // UPDATE patient (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable String id, @RequestBody Map<String, Object> updateData) {
        try {
            System.out.println("📝 Updating patient with ID: " + id);
            System.out.println("📝 Update data: " + updateData);
            
            PatientEntity updatedPatient = patientService.updatePatient(id, updateData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Patient updated successfully");
            response.put("data", updatedPatient);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // DELETE from queue (mark as completed, not actual delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromQueue(@PathVariable String id) {
        try {
            System.out.println("🗑️ Removing patient from queue (marking as completed): " + id);
            
            // This should mark as completed, not delete
            PatientEntity updatedPatient = patientService.updatePatientStatus(id, "completed", null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Patient removed from queue successfully");
            response.put("data", updatedPatient);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // UPDATE patient status only (PATCH)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updatePatientStatus(@PathVariable String id, @RequestBody Map<String, Object> statusData) {
        try {
            String status = (String) statusData.get("status");
            String assignedDoctor = (String) statusData.get("assignedDoctor");
            
            System.out.println("📝 Updating status for patient: " + id + " to: " + status);
            
            PatientEntity updatedPatient = patientService.updatePatientStatus(id, status, assignedDoctor);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Patient status updated successfully");
            response.put("data", updatedPatient);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // PERMANENT DELETE (only if needed for admin)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<?> permanentDeletePatient(@PathVariable String id) {
        try {
            System.out.println("⚠️ PERMANENTLY deleting patient with ID: " + id);
            
            patientService.deletePatient(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Patient permanently deleted from records");
            response.put("patientId", id);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.badRequest().body(errorResponse);
    }
}