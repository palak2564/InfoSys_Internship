package com.example.repository;

import com.example.model.Parking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingRepository extends MongoRepository<Parking, String> {
    List<Parking> findByBlock(String block);
    Optional<Parking> findByParkingId(String parkingId);
}