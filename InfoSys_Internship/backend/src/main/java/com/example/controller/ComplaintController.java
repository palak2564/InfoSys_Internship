package com.example.controller;

import com.example.model.Complaint;
import com.example.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Simple endpoint to check if API is alive
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("API is working");
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        try {
            List<Complaint> complaints = complaintService.findAllComplaints();
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        try {
            return complaintService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Complaint>> getComplaintsByStatus(@PathVariable String status) {
        try {
            List<Complaint> complaints = complaintService.findByStatus(status);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Complaint>> searchComplaints(@RequestParam String query) {
        try {
            List<Complaint> complaints = complaintService.searchComplaints(query);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        try {
            Complaint savedComplaint = complaintService.saveComplaint(complaint);
            return ResponseEntity.ok(savedComplaint);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            String adminRemarks = statusUpdate.getOrDefault("adminRemarks", "");
            
            return complaintService.updateStatus(id, status, adminRemarks)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<Complaint> closeComplaint(@PathVariable String id) {
        try {
            return complaintService.closeComplaint(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}