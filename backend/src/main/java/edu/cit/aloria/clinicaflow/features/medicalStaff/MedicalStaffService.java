package edu.cit.aloria.clinicaflow.features.medicalStaff;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffRepository;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountRepository;
import edu.cit.aloria.clinicaflow.features.consultation.ConsultationRepository;

@Service
public class MedicalStaffService {

    @Autowired
    private MedicalStaffRepository repository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

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

    // ADD THIS - Get staff by email
    public Optional<MedicalStaffEntity> getStaffByEmail(String email) {
        return repository.findByEmail(email);
    }

    public MedicalStaffEntity updateStaff(int id, MedicalStaffEntity staffDetails) {
        MedicalStaffEntity staff = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));

        if (staffDetails.getFname() != null) {
            staff.setFname(staffDetails.getFname());
        }
        if (staffDetails.getLname() != null) {
            staff.setLname(staffDetails.getLname());
        }
        if (staffDetails.getRole() != null) {
            staff.setRole(staffDetails.getRole());
        }
        if (staffDetails.getContactNo() != null) {
            staff.setContactNo(staffDetails.getContactNo());
        }
        if (staffDetails.getSpecialty() != null) {
            staff.setSpecialty(staffDetails.getSpecialty());
        }
        if (staffDetails.getEmail() != null) {
            staff.setEmail(staffDetails.getEmail());
        }
        if (staffDetails.getAvailability() != null) {
            staff.setAvailability(staffDetails.getAvailability());
        }
        if (staffDetails.getPhoto() != null) {
            staff.setPhoto(staffDetails.getPhoto());
        }
        if (staffDetails.getUserAccount() != null) {
            staff.setUserAccount(staffDetails.getUserAccount());
        }

        return repository.save(staff);
    }

    public void deleteStaff(int id) {
        MedicalStaffEntity staff = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));

        // Check if staff has consultations (by doctor name)
        String fullName = staff.getFname() + " " + staff.getLname();
        boolean hasConsultations = consultationRepository.existsByDoctorName(fullName);

        if (hasConsultations) {
            throw new RuntimeException("Cannot delete staff. This staff has existing consultation records. Delete or reassign consultations first.");
        }

        repository.delete(staff);
    }

    public List<MedicalStaffEntity> getStaffByRole(String role) {
        return repository.findByRole(role);
    }

    public List<MedicalStaffEntity> getStaffBySpecialty(String specialty) {
        return repository.findBySpecialty(specialty);
    }

    public List<UserAccountEntity> getAllUsers() {
        return userAccountRepository.findAll();
    }

    public Optional<UserAccountEntity> getUserByEmail(String email) {
        return userAccountRepository.findByEmail(email);
    }

// Sync single user to medical_staff only if not already exists
public void syncUserIfNotExists(UserAccountEntity user) {
    try {
        // Check if staff already exists by email
        Optional<MedicalStaffEntity> existingStaff = repository.findByEmail(user.getEmail());

        if (existingStaff.isEmpty()) {
            // Create new medical staff record only if doesn't exist
            MedicalStaffEntity staff = new MedicalStaffEntity();
            staff.setFname(user.getFirstName());
            staff.setLname(user.getLastName());
            // Format role properly - capitalize first letter
            String role = user.getRole();
            if (role != null) {
                role = role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
            }
            staff.setRole(role != null ? role : "Doctor");
            staff.setSpecialty(user.getSpecialization() != null ? user.getSpecialization() : "General Medicine");
            staff.setEmail(user.getEmail());
            staff.setContactNo(user.getPhone() != null ? user.getPhone() : "Not provided");
            staff.setAvailability(user.getAvailability() != null ? user.getAvailability() : "Available");
            staff.setUserAccount(user);
            staff.setPhoto(user.getPhoto() != null ? user.getPhoto() : user.getPicture());

            repository.save(staff);
            System.out.println("✅ Synced new user to medical_staff: " + user.getEmail());
        } else {
            // Update existing staff with latest user info
            MedicalStaffEntity staff = existingStaff.get();
            staff.setFname(user.getFirstName());
            staff.setLname(user.getLastName());
            // Format role properly
            String role = user.getRole();
            if (role != null) {
                role = role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
            }
            staff.setRole(role != null ? role : staff.getRole());
            staff.setSpecialty(user.getSpecialization() != null ? user.getSpecialization() : staff.getSpecialty());
            staff.setEmail(user.getEmail());
            staff.setContactNo(user.getPhone() != null ? user.getPhone() : staff.getContactNo());
            staff.setAvailability(user.getAvailability() != null ? user.getAvailability() : staff.getAvailability());
            staff.setUserAccount(user);
            if (user.getPhoto() != null) {
                staff.setPhoto(user.getPhoto());
            } else if (user.getPicture() != null) {
                staff.setPhoto(user.getPicture());
            }

            repository.save(staff);
            System.out.println("✅ Updated existing medical_staff record for: " + user.getEmail());
        }
    } catch (Exception e) {
        System.err.println("❌ Error syncing user to medical_staff: " + e.getMessage());
        e.printStackTrace();
    }
}
        // Update user account
    public void updateUserAccount(UserAccountEntity user) {
        userAccountRepository.save(user);
    }
}