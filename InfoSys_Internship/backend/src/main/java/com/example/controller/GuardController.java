package com.example.controller;

import com.example.model.Guard;
import com.example.repository.GuardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/guards")
@CrossOrigin(origins = "http://localhost:5173/")
public class GuardController {

    private final GuardRepository guardRepository;

    @Autowired
    public GuardController(GuardRepository guardRepository) {
        this.guardRepository = guardRepository;
    }

    // Get All Guards
    @GetMapping
    public List<Guard> getAllGuards() {
        return guardRepository.findAll();
    }

    // Add a New Guard
    @PostMapping
    public Guard addGuard(@RequestBody Guard guard) {
        return guardRepository.save(guard);
    }

    // Get Guard by ID
    @GetMapping("/{id}")
    public ResponseEntity<Guard> getGuardById(@PathVariable String id) {
        Optional<Guard> guard = guardRepository.findById(id);
        return guard.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete Guard by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGuard(@PathVariable String id) {
        guardRepository.deleteById(id);
        return ResponseEntity.ok("Guard deleted successfully.");
    }
}
