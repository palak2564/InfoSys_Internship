package com.example.controller;

import com.example.model.Resident;
import com.example.repository.ResidentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/residents")
@CrossOrigin(origins = "http://localhost:5173")
public class ResidentController {
    private final ResidentRepository residentRepository;

    public ResidentController(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        boolean exists = residentRepository.findByEmail(email).isPresent();
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerResident(@RequestBody Resident resident) {
        if (residentRepository.findByEmail(resident.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "Resident already exists with this email"));
        }
        
        if (resident.getBlock() == null || resident.getBlock().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Block is required"));
        }
        if (resident.getFlatNo() == null || resident.getFlatNo().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Flat Number is required"));
        }

        // Set role to "resident"
        resident.setRole("resident");
        residentRepository.save(resident);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", "Resident registered successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResidentById(@PathVariable String id) {
        return residentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-email")
    public ResponseEntity<?> getResidentByEmail(@RequestParam String email) {
        return residentRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResident(@PathVariable String id, @RequestBody Resident updatedResident) {
        return residentRepository.findById(id).map(resident -> {
            if (updatedResident.getName() != null) resident.setName(updatedResident.getName());
            if (updatedResident.getPhoneNo() != null) resident.setPhoneNo(updatedResident.getPhoneNo());
            if (updatedResident.getBlock() != null) resident.setBlock(updatedResident.getBlock());
            if (updatedResident.getFlatNo() != null) resident.setFlatNo(updatedResident.getFlatNo());
            if (updatedResident.getSocietyName() != null) resident.setSocietyName(updatedResident.getSocietyName());
            residentRepository.save(resident);
            return ResponseEntity.ok(Collections.singletonMap("message", "Resident updated successfully"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResident(@PathVariable String id) {
        if (residentRepository.existsById(id)) {
            residentRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Resident deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<Resident>> getAllResidents() {
        return ResponseEntity.ok(residentRepository.findAll());
    }
    
    @GetMapping("/flat-numbers")
    public ResponseEntity<List<String>> getAllFlatNumbers() {
        List<String> flatNumbers = residentRepository.findAll()
                .stream()
                .map(Resident::getFlatNo)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        return ResponseEntity.ok(flatNumbers);
    }
}