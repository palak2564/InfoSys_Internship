package com.example.controller;

import com.example.model.Vendor;
import com.example.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;
    @PostMapping("/add")
    public ResponseEntity<?> addVendor(@RequestBody Vendor vendor) {
        try {
            Vendor savedVendor = vendorRepository.save(vendor);
            return ResponseEntity.ok(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add vendor");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllVendors() {
        try {
            List<Vendor> vendors = vendorRepository.findAll();
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch vendors");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVendor(
        @PathVariable String id, 
        @RequestBody Vendor updatedVendor
    ) {
        try {
            Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

            // Update vendor details
            existingVendor.setName(updatedVendor.getName());
            existingVendor.setService(updatedVendor.getService());
            existingVendor.setCompany(updatedVendor.getCompany());
            existingVendor.setPhoneNo(updatedVendor.getPhoneNo());

            Vendor savedVendor = vendorRepository.save(existingVendor);
            return ResponseEntity.ok(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update vendor");
        }
    }
}
