package com.example.controller;

import com.example.model.Resident;
import com.example.repository.ResidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ResidentRepository residentRepository;

    public DashboardController(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        List<Resident> residents = residentRepository.findAll();

        // Unique blocks (e.g. A–F)
        Set<String> uniqueBlocks = residents.stream()
                .map(Resident::getBlock)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Group by block
        Map<String, Long> residentsPerBlock = residents.stream()
                .filter(r -> r.getBlock() != null)
                .collect(Collectors.groupingBy(Resident::getBlock, Collectors.counting()));

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalBlocks", uniqueBlocks.size());
        stats.put("totalResidents", residents.size());
        stats.put("totalFlats", residents.size()); // adjust if needed
        stats.put("residentsPerBlock", residentsPerBlock);

        return stats;
    }
}
