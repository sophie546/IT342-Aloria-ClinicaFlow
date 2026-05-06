package edu.cit.aloria.clinicaflow.features.patient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, String> {
    
    List<PatientEntity> findByStatusOrderByQueueNumberAsc(String status);
    
    // Fixed query - using native query for date comparison
    @Query(value = "SELECT MAX(queue_number) FROM patients WHERE DATE(created_at) = CURRENT_DATE", nativeQuery = true)
    Integer findMaxQueueNumberForToday();
    
    // Fixed query for counting
    @Query("SELECT COUNT(p) FROM PatientEntity p WHERE p.status = :status AND p.createdAt < :createdAt")
    Long countByStatusAndCreatedAtBefore(@Param("status") String status, @Param("createdAt") LocalDateTime createdAt);
    
    Long countByStatus(String status);
    
    @Query("SELECT p FROM PatientEntity p WHERE p.status = 'waiting' ORDER BY p.queueNumber ASC")
    List<PatientEntity> findWaitingQueue();
}