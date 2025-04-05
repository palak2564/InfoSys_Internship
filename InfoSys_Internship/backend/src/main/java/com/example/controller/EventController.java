package com.example.controller;

import com.example.model.Event;
import com.example.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {
    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody Event event) {
        Event savedEvent = eventRepository.save(event);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Event created successfully");
        response.put("event", savedEvent);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateEvent(@PathVariable String id, @RequestBody Event updatedEvent) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (updatedEvent.getTitle() != null) event.setTitle(updatedEvent.getTitle());
                    if (updatedEvent.getDate() != null) event.setDate(updatedEvent.getDate());
                    if (updatedEvent.getTime() != null) event.setTime(updatedEvent.getTime());
                    if (updatedEvent.getDescription() != null) event.setDescription(updatedEvent.getDescription());
                    eventRepository.save(event);
                    return ResponseEntity.ok(Collections.singletonMap("message", "Event updated successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable String id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Event deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
