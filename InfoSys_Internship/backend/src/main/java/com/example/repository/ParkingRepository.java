package com.example.repository;

import com.example.model.Parking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingRepository extends MongoRepository<Parking, String> {
    
    List<Parking> findByBlock(String block);
    
    List<Parking> findByIsOccupied(boolean isOccupied);
    
    List<Parking> findByBlockAndIsOccupied(String block, boolean isOccupied);
    
    Parking findByParkingId(String parkingId);
    
    Parking findByFlatNumber(String flatNumber);
    
    List<Parking> findByAssignedTo(String userId);
}

