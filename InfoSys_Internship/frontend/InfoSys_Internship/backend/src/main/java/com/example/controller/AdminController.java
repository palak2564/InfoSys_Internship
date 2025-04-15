package com.example.controller;

import com.example.model.Admin;
import com.example.repository.AdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admins")  
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        boolean exists = adminRepository.findByEmail(email).isPresent();
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("message", "Admin already exists"));
        }
        adminRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", "Admin registered successfully"));
    }

    @PostMapping
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Login successful"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Invalid credentials"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable String id) {
        return adminRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable String id, @RequestBody Admin updatedAdmin) {
        return adminRepository.findById(id).map(admin -> {
            if (updatedAdmin.getName() != null) admin.setName(updatedAdmin.getName());
            if (updatedAdmin.getPhoneNumber() != null) admin.setPhoneNumber(updatedAdmin.getPhoneNumber());
            if (updatedAdmin.getSocietyName() != null) admin.setSocietyName(updatedAdmin.getSocietyName());
            if (updatedAdmin.getAddress() != null) admin.setAddress(updatedAdmin.getAddress());
            adminRepository.save(admin);
            return ResponseEntity.ok(Collections.singletonMap("message", "Admin updated successfully"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Admin deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
