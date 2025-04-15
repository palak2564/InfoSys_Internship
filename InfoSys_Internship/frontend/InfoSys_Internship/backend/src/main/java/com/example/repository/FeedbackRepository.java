package com.example.repository;

import com.example.model.Feedback;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class FeedbackRepository {
    
    private final List<Feedback> feedbacks = new ArrayList<>();
    
    public List<Feedback> findAll() {
        return new ArrayList<>(feedbacks);
    }
    
    public Optional<Feedback> findById(String id) {
        return feedbacks.stream()
                .filter(feedback -> feedback.getId().equals(id))
                .findFirst();
    }
    
    public List<Feedback> findByEventId(String eventId) {
        return feedbacks.stream()
                .filter(feedback -> feedback.getEventId().equals(eventId))
                .sorted((f1, f2) -> f2.getCreatedAt().compareTo(f1.getCreatedAt())) // Order by createdAt desc
                .collect(Collectors.toList());
    }
    
    public Feedback save(Feedback feedback) {
        if (feedback.getId() == null) {
            feedback.setId(UUID.randomUUID().toString());
            feedbacks.add(feedback);
        } else {
            // Update existing feedback
            for (int i = 0; i < feedbacks.size(); i++) {
                if (feedbacks.get(i).getId().equals(feedback.getId())) {
                    feedbacks.set(i, feedback);
                    break;
                }
            }
        }
        return feedback;
    }
    
    public boolean existsById(String id) {
        return feedbacks.stream().anyMatch(feedback -> feedback.getId().equals(id));
    }
    
    public void deleteById(String id) {
        feedbacks.removeIf(feedback -> feedback.getId().equals(id));
    }
}
