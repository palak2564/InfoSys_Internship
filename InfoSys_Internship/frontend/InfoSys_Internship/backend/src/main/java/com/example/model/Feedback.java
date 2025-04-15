package com.example.model;

import java.time.LocalDateTime;

public class Feedback {
    private String id;
    private int rating;
    private String comment;
    private String eventId;
    private LocalDateTime createdAt;
    
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Feedback(String id, int rating, String comment, String eventId) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.eventId = eventId;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
