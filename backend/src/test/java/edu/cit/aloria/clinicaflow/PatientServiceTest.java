package edu.cit.aloria.clinicaflow;

import edu.cit.aloria.clinicaflow.features.patient.PatientEntity;
import edu.cit.aloria.clinicaflow.features.patient.PatientService;
import edu.cit.aloria.clinicaflow.features.authentication.dto.PatientRegistrationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class PatientServiceTest {

    @Autowired
    private PatientService patientService;

    @Test
    void TC017_getAllPatients_shouldReturnList() {
        List<PatientEntity> patients = patientService.getAllPatients();

        assertNotNull(patients);
        assertTrue(patients.size() >= 0);
    }

    @Test
    void TC018_getQueueLength_shouldReturnValidCount() {
        Long queueLength = patientService.getQueueLength();

        assertNotNull(queueLength);
        assertTrue(queueLength >= 0);
    }

    @Test
    void TC019_registerToQueue_shouldAssignQueueNumber() {
        PatientRegistrationRequest request = new PatientRegistrationRequest();
        request.setFirstName("Test");
        request.setLastName("Patient");
        request.setAge(25);
        request.setGender("Male");
        request.setContactNumber("09123456789");
        request.setAddress("123 Test Street, Cebu City");

        PatientEntity patient = patientService.registerToQueue(request);

        assertNotNull(patient);
        assertNotNull(patient.getQueueNumber());
        assertTrue(patient.getQueueNumber() > 0);
        assertEquals("waiting", patient.getStatus());
    }

    @Test
    void TC023_getCurrentQueue_shouldReturnWaitingPatients() {
        List<PatientEntity> queue = patientService.getCurrentQueue();

        assertNotNull(queue);
        queue.forEach(p -> 
            assertTrue(p.getStatus().equals("waiting") || 
                      p.getStatus().equals("consulting"))
        );
    }
}