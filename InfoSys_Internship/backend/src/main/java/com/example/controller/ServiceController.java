package com.example.controller;

import com.example.model.Service;
import com.example.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createServiceRequest(@RequestBody Service service) {
        try {
            service.setCreatedAt(LocalDateTime.now());
            service.setStatus(Service.ServiceStatus.PENDING);

            Service savedService = serviceRepository.save(service);
            return ResponseEntity.ok(savedService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create service request");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserServiceRequests(@RequestParam String userId) {
        try {
            List<Service> userServices = serviceRepository.findByUserId(userId);
            return ResponseEntity.ok(userServices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch service requests");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllServiceRequests() {
        try {
            List<Service> allServices = serviceRepository.findAll();
            return ResponseEntity.ok(allServices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch service requests");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateServiceRequest(
        @PathVariable String id, 
        @RequestBody Service updatedService
    ) {
        try {
            Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

            existingService.setStatus(updatedService.getStatus());
            existingService.setVendorName(updatedService.getVendorName());
            existingService.setVendorCompany(updatedService.getVendorCompany());
            existingService.setUpdatedAt(LocalDateTime.now());

            Service savedService = serviceRepository.save(existingService);
            return ResponseEntity.ok(savedService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update service request");
        }
    }
}
