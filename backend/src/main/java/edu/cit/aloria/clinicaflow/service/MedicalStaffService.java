package edu.cit.aloria.clinicaflow.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.aloria.clinicaflow.entity.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.repository.MedicalStaffRepository;
import edu.cit.aloria.clinicaflow.repository.UserAccountRepository;

@Service
public class MedicalStaffService {

    @Autowired
    private MedicalStaffRepository repository;
    
    @Autowired
    private UserAccountRepository userAccountRepository;

    public MedicalStaffEntity addStaff(MedicalStaffEntity staff) {
        return repository.save(staff);
    }

    public List<MedicalStaffEntity> getAllStaff() {
        return repository.findAll();
    }

    public Optional<MedicalStaffEntity> getStaffById(int id) {
        return repository.findById(id);
    }

    public Optional<MedicalStaffEntity> getStaffByAccountId(int accountId) {
        return repository.findByUserAccount_AccountID(accountId);
    }

    public MedicalStaffEntity updateStaff(int id, MedicalStaffEntity staffDetails) {
        MedicalStaffEntity staff = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
        
        staff.setFname(staffDetails.getFname());
        staff.setLname(staffDetails.getLname());
        staff.setRole(staffDetails.getRole());
        staff.setContactNo(staffDetails.getContactNo());
        staff.setSpecialty(staffDetails.getSpecialty());
        
        if (staffDetails.getUserAccount() != null) {
            staff.setUserAccount(staffDetails.getUserAccount());
        }
        
        return repository.save(staff);
    }

    public void deleteStaff(int id) {
        MedicalStaffEntity staff = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
        repository.delete(staff);
    }
    
    public List<MedicalStaffEntity> getStaffByRole(String role) {
        return repository.findByRole(role);
    }
    
    public List<MedicalStaffEntity> getStaffBySpecialty(String specialty) {
        return repository.findBySpecialty(specialty);
    }
    
    // NEW: Get all users from user_account
    public List<UserAccountEntity> getAllUsers() {
        return userAccountRepository.findAll();
    }
    
    // NEW: Get user by email
    public Optional<UserAccountEntity> getUserByEmail(String email) {
        return userAccountRepository.findByEmail(email);
    }
}