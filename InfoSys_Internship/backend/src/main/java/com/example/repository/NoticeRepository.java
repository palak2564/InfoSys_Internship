package com.example.repository;

import com.example.model.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
    
    // Find notices by title containing the given string (case insensitive)
    List<Notice> findByTitleContainingIgnoreCase(String title);
    
    // Find notices created after a specific date
    List<Notice> findByCreatedAtAfter(Date date);
    
    // Find notices by creator
    List<Notice> findByCreatedBy(String createdBy);
    
    // Find notices sorted by creation date (newest first)
    List<Notice> findAllByOrderByCreatedAtDesc();
}
