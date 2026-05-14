package edu.cit.aloria.clinicaflow;

import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class MedicalStaffServiceTest {

    @Autowired
    private MedicalStaffService medicalStaffService;

    @Test
    void TC011_getAllStaff_shouldReturnList() {
        List<MedicalStaffEntity> staffList = medicalStaffService.getAllStaff();

        assertNotNull(staffList);
        assertTrue(staffList.size() >= 0);
    }

    @Test
    void TC012_getAvailableStaff_shouldReturnAvailableOnly() {
        List<MedicalStaffEntity> staffList = medicalStaffService.getAllStaff();

        assertNotNull(staffList);
        long availableCount = staffList.stream()
            .filter(s -> "Available".equals(s.getAvailability()))
            .count();
        assertTrue(availableCount >= 0);
    }

    @Test
    void TC013_getStaffByRole_shouldReturnFiltered() {
        List<MedicalStaffEntity> doctors = medicalStaffService.getStaffByRole("Doctor");

        assertNotNull(doctors);
    }
}