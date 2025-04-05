package com.example.repository;

import com.example.model.EmergencyContact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyContactRepository extends MongoRepository<EmergencyContact, String> {
    List<EmergencyContact> findByBlock(String block);
    List<EmergencyContact> findByContactType(EmergencyContact.ContactType contactType);
    List<EmergencyContact> findByBlockAndContactType(String block, EmergencyContact.ContactType contactType);
}