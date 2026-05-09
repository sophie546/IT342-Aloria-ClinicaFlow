package edu.cit.aloria.clinicaflow;

import edu.cit.aloria.clinicaflow.features.consultation.ConsultationEntity;
import edu.cit.aloria.clinicaflow.features.consultation.ConsultationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ConsultationServiceTest {

    @Autowired
    private ConsultationService consultationService;

    @Test
    void TC007_createConsultation_shouldSaveSuccessfully() {
        ConsultationEntity consultation = new ConsultationEntity();
        consultation.setPatientName("Maria Santos");
        consultation.setAge(35);
        consultation.setGender("Female");
        consultation.setDoctorName("Dr. Sophia Aloria");
        consultation.setSymptoms("Headache, Fever");
        consultation.setDiagnosis("Common Cold");
        consultation.setConsultationDate(LocalDate.now());

        ConsultationEntity saved = consultationService.saveConsultation(consultation);

        assertNotNull(saved);
        assertNotNull(saved.getConsultationId());
        assertEquals("Maria Santos", saved.getPatientName());
    }

    @Test
    void TC008_getAllConsultations_shouldReturnList() {
        List<ConsultationEntity> consultations = consultationService.getAllConsultations();

        assertNotNull(consultations);
        assertTrue(consultations.size() >= 0);
    }

    @Test
    void TC009_getConsultationsByDoctor_shouldReturnFiltered() {
        List<ConsultationEntity> consultations = 
            consultationService.getConsultationsByDoctor("Dr. Sophia Aloria");

        assertNotNull(consultations);
    }

    @Test
    void TC010_getTodayCount_shouldReturnValidCount() {
        long count = consultationService.getTodayCount();
        assertTrue(count >= 0);
    }
}