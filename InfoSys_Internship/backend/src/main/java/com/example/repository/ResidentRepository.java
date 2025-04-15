package com.example.repository;

import com.example.model.Resident;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentRepository extends MongoRepository<Resident, String> {
    Optional<Resident> findByEmail(String email);
    Optional<Resident> findByFlatNo(String flatNo);
    Optional<Resident> findByPhoneNo(String phoneNo);
}