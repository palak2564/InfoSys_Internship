package com.example.controller;

import com.example.model.Complaint;
import com.example.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<Complaint> getComplaintsByStatus(@PathVariable String status) {
        return complaintRepository.findByStatus(status);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
        @PathVariable String id, 
        @RequestBody String status
    ) {
        return complaintRepository.findById(id)
            .map(complaint -> {
                complaint.setStatus(status);
                return ResponseEntity.ok(complaintRepository.save(complaint));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
