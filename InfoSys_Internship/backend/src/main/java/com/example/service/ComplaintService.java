package com.example.service;

import com.example.model.Complaint;
import com.example.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<Complaint> findAllComplaints() {
        return complaintRepository.findAll();
    }

    public Optional<Complaint> findById(String id) {
        return complaintRepository.findById(id);
    }
    
    public List<Complaint> findByStatus(String status) {
        return complaintRepository.findByStatus(status);
    }

    public List<Complaint> searchComplaints(String query) {
        return complaintRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrNameContainingIgnoreCaseOrRoomContainingIgnoreCase(
                query, query, query, query);
    }

    public Complaint saveComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public Optional<Complaint> updateStatus(String id, String status, String adminRemarks) {
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        
        if (complaintOpt.isPresent()) {
            Complaint complaint = complaintOpt.get();
            complaint.setStatus(status);
            // Update other fields as needed
            return Optional.of(complaintRepository.save(complaint));
        }
        
        return Optional.empty();
    }

    public Optional<Complaint> closeComplaint(String id) {
        Optional<Complaint> complaintOpt = complaintRepository.findById(id);
        
        if (complaintOpt.isPresent()) {
            Complaint complaint = complaintOpt.get();
            complaint.setStatus("CLOSED");
            return Optional.of(complaintRepository.save(complaint));
        }
        
        return Optional.empty();
    }
}