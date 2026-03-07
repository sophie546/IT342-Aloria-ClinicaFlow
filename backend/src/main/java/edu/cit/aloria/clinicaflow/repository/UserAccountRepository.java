package edu.cit.aloria.clinicaflow.repository;

import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Integer> {
    Optional<UserAccountEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}