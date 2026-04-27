package edu.cit.aloria.clinicaflow.features.consultation;

import edu.cit.aloria.clinicaflow.features.consultation.ConsultationEntity;
import edu.cit.aloria.clinicaflow.features.consultation.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    // CREATE - Save new consultation
    @PostMapping("/add")
    public ResponseEntity<ConsultationEntity> addConsultation(@RequestBody ConsultationEntity consultation) {
        try {
            ConsultationEntity saved = consultationService.saveConsultation(consultation);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL
    @GetMapping("/all")
    public ResponseEntity<List<ConsultationEntity>> getAllConsultations() {
        try {
            List<ConsultationEntity> consultations = consultationService.getAllConsultations();
            if (consultations.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(consultations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ by ID
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationEntity> getConsultationById(@PathVariable int id) {
        Optional<ConsultationEntity> consultation = consultationService.getConsultationById(id);
        return consultation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // READ by Date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ConsultationEntity>> getConsultationsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ConsultationEntity> consultations = consultationService.getConsultationsByDate(date);
        return ResponseEntity.ok(consultations);
    }

    // READ by Doctor
    @GetMapping("/doctor/{doctorName}")
    public ResponseEntity<List<ConsultationEntity>> getConsultationsByDoctor(@PathVariable String doctorName) {
        List<ConsultationEntity> consultations = consultationService.getConsultationsByDoctor(doctorName);
        return ResponseEntity.ok(consultations);
    }

    // GET Today's Count
    @GetMapping("/today/count")
    public ResponseEntity<Long> getTodayCount() {
        long count = consultationService.getTodayCount();
        return ResponseEntity.ok(count);
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<ConsultationEntity> updateConsultation(@PathVariable int id, @RequestBody ConsultationEntity consultation) {
        try {
            ConsultationEntity updated = consultationService.updateConsultation(id, consultation);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteConsultation(@PathVariable int id) {
        try {
            consultationService.deleteConsultation(id);
            return new ResponseEntity<>("Consultation deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting consultation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
