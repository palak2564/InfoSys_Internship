package com.example.controller;

import com.example.model.Notice;
import com.example.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    // Get all notices
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        try {
            List<Notice> notices = noticeRepository.findAllByOrderByCreatedAtDesc();
            return new ResponseEntity<>(notices, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get notice by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable("id") String id) {
        Optional<Notice> noticeData = noticeRepository.findById(id);
        
        if (noticeData.isPresent()) {
            return new ResponseEntity<>(noticeData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Create new notice
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        try {
            // Set creation date
            notice.setCreatedAt(new Date());
            notice.setUpdatedAt(new Date());
            
            // Default values if not provided
            if (notice.getIcon() == null || notice.getIcon().isEmpty()) {
                notice.setIcon("!");
            }
            
            if (notice.getIconBgColor() == null || notice.getIconBgColor().isEmpty()) {
                notice.setIconBgColor("#f44336");
            }
            
            Notice savedNotice = noticeRepository.save(notice);
            return new ResponseEntity<>(savedNotice, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update notice
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable("id") String id, @RequestBody Notice notice) {
        Optional<Notice> noticeData = noticeRepository.findById(id);
        
        if (noticeData.isPresent()) {
            Notice existingNotice = noticeData.get();
            existingNotice.setTitle(notice.getTitle());
            existingNotice.setContent(notice.getContent());
            existingNotice.setIcon(notice.getIcon());
            existingNotice.setIconBgColor(notice.getIconBgColor());
            existingNotice.setUpdatedAt(new Date());
            
            return new ResponseEntity<>(noticeRepository.save(existingNotice), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete notice
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteNotice(@PathVariable("id") String id) {
        try {
            noticeRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search notices by title
    @GetMapping("/search")
    public ResponseEntity<List<Notice>> searchNotices(@RequestParam("title") String title) {
        try {
            List<Notice> notices = noticeRepository.findByTitleContainingIgnoreCase(title);
            return new ResponseEntity<>(notices, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
