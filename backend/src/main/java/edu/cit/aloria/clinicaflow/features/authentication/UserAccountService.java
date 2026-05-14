package edu.cit.aloria.clinicaflow.features.authentication;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAccountService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    public Optional<UserAccountEntity> getUserById(Integer id) {
        return userAccountRepository.findByAccountID(id);
    }

    public Optional<UserAccountEntity> getUserByEmail(String email) {
        return userAccountRepository.findByEmail(email);
    }

    public UserAccountEntity saveUser(UserAccountEntity user) {
        return userAccountRepository.save(user);
    }

    public List<UserAccountEntity> getAllUsers() {
        return userAccountRepository.findAll();
    }

    public void deleteUser(Integer id) {
        userAccountRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userAccountRepository.findByEmail(email).isPresent();
    }
}