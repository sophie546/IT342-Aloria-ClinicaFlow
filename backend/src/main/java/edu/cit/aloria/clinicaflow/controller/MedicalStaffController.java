package edu.cit.aloria.clinicaflow.controller;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RestController;

import edu.cit.aloria.clinicaflow.entity.MedicalStaffEntity;
import edu.cit.aloria.clinicaflow.entity.UserAccountEntity;
import edu.cit.aloria.clinicaflow.service.MedicalStaffService;

@RestController
@RequestMapping("/api/medicalstaff")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class MedicalStaffController {

    @Autowired
    private MedicalStaffService service;

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
}