package edu.cit.aloria.clinicaflow.features.medicalStaff;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.aloria.clinicaflow.features.authentication.UserAccountRepository;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.features.authentication.UserAccountEntity;
import edu.cit.aloria.clinicaflow.features.medicalStaff.MedicalStaffService;


@RestController
@RequestMapping("/api/medicalstaff")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class MedicalStaffController {

    @Autowired
    private MedicalStaffService service;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @PostMapping("/sync-from-users")
public ResponseEntity<?> syncStaffFromUsers() {
    try {
        List<UserAccountEntity> doctorUsers = userAccountRepository.findByRole("DOCTOR");
        int created = 0;
        int updated = 0;
        
        for (UserAccountEntity user : doctorUsers) {
            Optional<MedicalStaffEntity> existing = service.getStaffByEmail(user.getEmail());
            
            if (existing.isEmpty()) {
                MedicalStaffEntity newStaff = new MedicalStaffEntity();
                newStaff.setFname(user.getFirstName());
                newStaff.setLname(user.getLastName());
                newStaff.setEmail(user.getEmail());
                String role = user.getRole();
                if (role != null) {
                    role = role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
                }
                newStaff.setRole(role != null ? role : "Doctor");
                newStaff.setSpecialty(user.getSpecialization() != null ? user.getSpecialization() : "General Medicine");
                newStaff.setContactNo(user.getPhone() != null ? user.getPhone() : "Not provided");
                newStaff.setAvailability(user.getAvailability() != null ? user.getAvailability() : "Available");
                newStaff.setUserAccount(user);
                newStaff.setPhoto(user.getPhoto() != null ? user.getPhoto() : user.getPicture());
                service.addStaff(newStaff);
                created++;
                System.out.println("✅ Created staff for: " + user.getEmail());
            } else {
                // Update existing
                MedicalStaffEntity staff = existing.get();
                staff.setFname(user.getFirstName());
                staff.setLname(user.getLastName());
                String role = user.getRole();
                if (role != null) {
                    role = role.substring(0, 1).toUpperCase() + role.substring(1).toLowerCase();
                }
                staff.setRole(role != null ? role : staff.getRole());
                staff.setSpecialty(user.getSpecialization() != null ? user.getSpecialization() : staff.getSpecialty());
                staff.setContactNo(user.getPhone() != null ? user.getPhone() : staff.getContactNo());
                staff.setAvailability(user.getAvailability() != null ? user.getAvailability() : staff.getAvailability());
                staff.setUserAccount(user);
                if (user.getPhoto() != null) {
                    staff.setPhoto(user.getPhoto());
                } else if (user.getPicture() != null) {
                    staff.setPhoto(user.getPicture());
                }
                service.updateStaff(staff.getStaffID(), staff);
                updated++;
                System.out.println("🔄 Updated staff for: " + user.getEmail());
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Synced " + created + " staff members, updated " + updated);
        response.put("created", created);
        response.put("updated", updated);
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
    
    // CREATE
    @PostMapping("/add")
    public ResponseEntity<MedicalStaffEntity> addStaff(@RequestBody MedicalStaffEntity staff) {
        try {
            MedicalStaffEntity savedStaff = service.addStaff(staff);
            return new ResponseEntity<>(savedStaff, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAccountEntity>> getAllUsers() {
        try {
            List<UserAccountEntity> users = service.getAllUsers();
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get current logged-in user by email
    @GetMapping("/user/by-email/{email}")
    public ResponseEntity<UserAccountEntity> getUserByEmail(@PathVariable String email) {
        try {
            Optional<UserAccountEntity> user = service.getUserByEmail(email);
            if (user.isPresent()) {
                return new ResponseEntity<>(user.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL
    @GetMapping("/all")
    public ResponseEntity<List<MedicalStaffEntity>> getAllStaff() {
        try {
            List<MedicalStaffEntity> staffList = service.getAllStaff();
            if (staffList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(staffList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ONE by ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicalStaffEntity> getStaffById(@PathVariable int id) {
        Optional<MedicalStaffEntity> staff = service.getStaffById(id);
        if (staff.isPresent()) {
            return new ResponseEntity<>(staff.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // READ by Account ID
    @GetMapping("/by-account/{accountId}")
    public ResponseEntity<MedicalStaffEntity> getStaffByAccountId(@PathVariable int accountId) {
        Optional<MedicalStaffEntity> staff = service.getStaffByAccountId(accountId);
        if (staff.isPresent()) {
            return new ResponseEntity<>(staff.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<MedicalStaffEntity> updateStaff(@PathVariable int id, @RequestBody MedicalStaffEntity staff) {
        try {
            MedicalStaffEntity updatedStaff = service.updateStaff(id, staff);
            return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable int id) {
        try {
            service.deleteStaff(id);
            return new ResponseEntity<>("Medical staff with ID " + id + " has been deleted.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting staff", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Search by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<MedicalStaffEntity>> getStaffByRole(@PathVariable String role) {
        try {
            List<MedicalStaffEntity> staffList = service.getStaffByRole(role);
            if (staffList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(staffList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Search by specialty
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<MedicalStaffEntity>> getStaffBySpecialty(@PathVariable String specialty) {
        try {
            List<MedicalStaffEntity> staffList = service.getStaffBySpecialty(specialty);
            if (staffList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(staffList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Upload photo for staff
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file, 
                                        @RequestParam(value = "email", required = false) String email,
                                        @RequestParam(value = "staffId", required = false) Integer staffId) {
        try {
            System.out.println("=== Upload Photo Request ===");
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            
            Optional<MedicalStaffEntity> staffOpt;
            
            // Try to find by email first, then by staffId
            if (email != null && !email.isEmpty()) {
                staffOpt = service.getStaffByEmail(email);
            } else if (staffId != null) {
                staffOpt = service.getStaffById(staffId);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Either email or staffId is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (staffOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Validate file
            if (file.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "File is empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "File size must be less than 5MB");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Get current staff to check for existing photo
            MedicalStaffEntity staff = staffOpt.get();
            String oldPhotoPath = staff.getPhoto();
            
            // Delete old photo file if it exists
            if (oldPhotoPath != null && !oldPhotoPath.isEmpty()) {
                // Extract filename from URL
                String oldFileName = oldPhotoPath.substring(oldPhotoPath.lastIndexOf("/") + 1);
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "staff_photos" + File.separator;
                File oldFile = new File(uploadDir + oldFileName);
                if (oldFile.exists()) {
                    boolean deleted = oldFile.delete();
                    System.out.println("Deleted old photo: " + oldFileName + " - " + deleted);
                }
            }
            
            // Create upload directory using absolute path
            String userDir = System.getProperty("user.dir");
            String uploadDir = userDir + File.separator + "uploads" + File.separator + "staff_photos" + File.separator;
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = System.currentTimeMillis() + "_" + email.replace("@", "_at_") + extension;
            String filePath = uploadDir + fileName;
            File destFile = new File(filePath);
            file.transferTo(destFile);
            
            String photoUrl = "http://localhost:8080/uploads/staff_photos/" + fileName;
            
            // Update staff with new photo URL
            staff.setPhoto(photoUrl);
            service.updateStaff(staff.getStaffID(), staff);
            
            // Also update user_account's photo field
            Optional<UserAccountEntity> userOpt = service.getUserByEmail(email);
            if (userOpt.isPresent()) {
                UserAccountEntity user = userOpt.get();
                user.setPhoto(photoUrl);
                service.updateUserAccount(user);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("photoUrl", photoUrl);
            response.put("message", "Photo uploaded successfully");
            
            System.out.println("✅ New photo saved: " + photoUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}