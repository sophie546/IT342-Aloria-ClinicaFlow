package edu.cit.aloria.clinicaflow.features.authentication;

import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Integer> {
    Optional<UserAccountEntity> findByEmail(String email);
    Optional<UserAccountEntity> findBySupabaseUserId(String supabaseUserId);
}
