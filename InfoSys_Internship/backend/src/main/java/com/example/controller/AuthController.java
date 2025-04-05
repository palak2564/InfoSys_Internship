package com.example.controller;

import java.util.Collections;
import com.example.model.Admin;
import com.example.model.Resident;
import com.example.repository.AdminRepository;
import com.example.repository.ResidentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final ResidentRepository residentRepository;
    private final AdminRepository adminRepository;

    public AuthController(ResidentRepository residentRepository, AdminRepository adminRepository) {
        this.residentRepository = residentRepository;
        this.adminRepository = adminRepository;
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        boolean exists = residentRepository.findByEmail(email).isPresent() || 
                         adminRepository.findByEmail(email).isPresent();
        
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Resident> residentOpt = residentRepository.findByEmail(email);
        if (residentOpt.isPresent()) {
            Resident resident = residentOpt.get();
            if (resident.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("user", resident);
                response.put("token", "resident-" + System.currentTimeMillis()); // Simple token generation
                return ResponseEntity.ok(response);
            }
        }
        
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("user", admin);
                response.put("token", "admin-" + System.currentTimeMillis()); // Simple token generation
                return ResponseEntity.ok(response);
            }
        }
        
        // If neither found or password incorrect
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Invalid credentials"));
    }
}
