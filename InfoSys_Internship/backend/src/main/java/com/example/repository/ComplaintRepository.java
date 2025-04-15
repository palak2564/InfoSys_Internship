package com.example.repository;

import com.example.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    
    List<Complaint> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrNameContainingIgnoreCaseOrRoomContainingIgnoreCase(
        String title, String description, String name, String room);
    
    List<Complaint> findByStatus(String status);
}