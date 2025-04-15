package com.example.controller;

import com.example.model.Parking;
import com.example.repository.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")  // Added to handle CORS issues
public class ParkingController {

    @Autowired
    private ParkingRepository parkingRepository;

    // Fetch all parking slots
    @GetMapping
    public ResponseEntity<List<Parking>> getAllParkingSlots() {
        List<Parking> parkingSlots = parkingRepository.findAll();
        return new ResponseEntity<>(parkingSlots, HttpStatus.OK);
    }

    // Get parking slot by ID
    @GetMapping("/{id}")
    public ResponseEntity<Parking> getParkingById(@PathVariable String id) {
        Optional<Parking> parking = parkingRepository.findById(id);
        return parking.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get parking slots by block
    @GetMapping("/block/{block}")
    public ResponseEntity<List<Parking>> getParkingByBlock(@PathVariable String block) {
        List<Parking> parkingSlots = parkingRepository.findByBlock(block);
        return new ResponseEntity<>(parkingSlots, HttpStatus.OK);
    }

    // Add a new parking slot
    @PostMapping
    public ResponseEntity<Parking> addParkingSlot(@RequestBody Parking parking) {
        Parking savedParking = parkingRepository.save(parking);
        return new ResponseEntity<>(savedParking, HttpStatus.CREATED);
    }

    // Update an existing parking slot
    @PutMapping("/{id}")
    public ResponseEntity<Parking> updateParkingSlot(@PathVariable String id, @RequestBody Parking parkingDetails) {
        Optional<Parking> existingParking = parkingRepository.findById(id);

        if (existingParking.isPresent()) {
            Parking updatedParking = existingParking.get();
            updatedParking.setParkingId(parkingDetails.getParkingId());
            updatedParking.setBlock(parkingDetails.getBlock());
            updatedParking.setFlatNo(parkingDetails.getFlatNo());
            updatedParking.setResidentName(parkingDetails.getResidentName());
            updatedParking.setOccupied(parkingDetails.isOccupied());

            Parking savedParking = parkingRepository.save(updatedParking);
            return new ResponseEntity<>(savedParking, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a parking slot
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParkingSlot(@PathVariable String id) {
        if (parkingRepository.existsById(id)) {
            parkingRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get parking statistics
    @GetMapping("/stats")
    public ResponseEntity<Object> getParkingStats() {
        List<Parking> allParkings = parkingRepository.findAll();
        final int TOTAL_PARKING_LOTS = 50;
        
        int occupiedCount = (int) allParkings.stream().filter(Parking::isOccupied).count();
        int unoccupiedCount = TOTAL_PARKING_LOTS - occupiedCount;
        
        return ResponseEntity.ok(
            Map.of(
                "totalParkingLots", TOTAL_PARKING_LOTS,
                "occupiedCount", occupiedCount,
                "unoccupiedCount", unoccupiedCount
            )
        );
    }
}