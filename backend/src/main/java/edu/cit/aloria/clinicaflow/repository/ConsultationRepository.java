package edu.cit.aloria.clinicaflow.repository;

import edu.cit.aloria.clinicaflow.entity.ConsultationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<ConsultationEntity, Integer> {
    
    List<ConsultationEntity> findByConsultationDate(LocalDate date);
    
    List<ConsultationEntity> findByDoctorName(String doctorName);
    
    List<ConsultationEntity> findByUserAccount_AccountID(int accountId);
    
    long countByConsultationDate(LocalDate date);
}