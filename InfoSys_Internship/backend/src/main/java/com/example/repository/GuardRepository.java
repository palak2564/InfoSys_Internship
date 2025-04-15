package com.example.repository;

import com.example.model.Guard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuardRepository extends MongoRepository<Guard, String> {
}
