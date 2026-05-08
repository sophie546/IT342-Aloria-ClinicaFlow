package edu.cit.aloria.clinicaflow.features.authentication;

import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Integer> {
    
    // Returns a single user by email (throws exception if multiple found)
    Optional<UserAccountEntity> findByEmail(String email);
    
    // Returns ALL users with the given email (use this to check for duplicates)
    List<UserAccountEntity> findAllByEmail(String email);
    
    // Returns first user with given email (safe for duplicates)
    @Query(value = "SELECT * FROM user_account WHERE email = :email LIMIT 1", nativeQuery = true)
    Optional<UserAccountEntity> findFirstByEmail(@Param("email") String email);
    
    Optional<UserAccountEntity> findBySupabaseUserId(String supabaseUserId);
    
    List<UserAccountEntity> findByRole(String role);
    
    Optional<UserAccountEntity> findByAccountID(Integer accountID);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    
    // Delete duplicates (keep the one with highest accountid)
    @Query(value = "DELETE FROM user_account WHERE email = :email AND accountid NOT IN (SELECT MAX(accountid) FROM user_account WHERE email = :email)", nativeQuery = true)
    void deleteDuplicateEmails(@Param("email") String email);
}