package com.example.controller;

import com.example.model.Feedback;
import com.example.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {
    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable String id) {
        return feedbackRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByEventId(@PathVariable String eventId) {
        List<Feedback> feedbacks = feedbackRepository.findByEventId(eventId);
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackRepository.save(feedback);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Feedback submitted successfully");
        response.put("feedback", savedFeedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateFeedback(@PathVariable String id, @RequestBody Feedback updatedFeedback) {
        return feedbackRepository.findById(id)
                .map(feedback -> {
                    if (updatedFeedback.getRating() != 0) feedback.setRating(updatedFeedback.getRating());
                    if (updatedFeedback.getComment() != null) feedback.setComment(updatedFeedback.getComment());
                    feedbackRepository.save(feedback);
                    return ResponseEntity.ok(Collections.singletonMap("message", "Feedback updated successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable String id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Feedback deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
