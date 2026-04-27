package edu.cit.aloria.clinicaflow.features.medicalStaff;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffEntity;

@Repository
public interface MedicalStaffRepository extends JpaRepository<MedicalStaffEntity, Integer> {
    
    Optional<MedicalStaffEntity> findByUserAccount_AccountID(int accountId);
    List<MedicalStaffEntity> findByRole(String role);
    Optional<MedicalStaffEntity> findByEmail(String email);
    List<MedicalStaffEntity> findBySpecialty(String specialty);
}
