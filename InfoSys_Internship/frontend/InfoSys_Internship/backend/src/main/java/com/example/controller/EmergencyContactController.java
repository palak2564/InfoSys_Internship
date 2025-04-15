package com.example.controller;

import com.example.model.EmergencyContact;
import com.example.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-contacts")
@CrossOrigin(origins = "*")
public class EmergencyContactController {

    private final EmergencyContactRepository emergencyContactRepository;

    @Autowired
    public EmergencyContactController(EmergencyContactRepository emergencyContactRepository) {
        this.emergencyContactRepository = emergencyContactRepository;
    }

    @GetMapping
    public List<EmergencyContact> getAllContacts(
            @RequestParam(required = false) String block,
            @RequestParam(required = false) String contactType) {

        // If both block and contactType are provided
        if (block != null && contactType != null) {
            try {
                EmergencyContact.ContactType type = EmergencyContact.ContactType.valueOf(contactType.toUpperCase());
                return emergencyContactRepository.findByBlockAndContactType(block, type);
            } catch (IllegalArgumentException e) {
                return emergencyContactRepository.findByBlock(block);
            }
        }
        // If only block is provided
        else if (block != null) {
            return emergencyContactRepository.findByBlock(block);
        }
        // If only contactType is provided
        else if (contactType != null) {
            try {
                EmergencyContact.ContactType type = EmergencyContact.ContactType.valueOf(contactType.toUpperCase());
                return emergencyContactRepository.findByContactType(type);
            } catch (IllegalArgumentException e) {
                return emergencyContactRepository.findAll();
            }
        }
        // If neither is provided
        else {
            return emergencyContactRepository.findAll();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyContact> getContactById(@PathVariable String id) {
        return emergencyContactRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public EmergencyContact createContact(@RequestBody EmergencyContact contact) {
        // Set the contactType to SECURITY if not provided
        if (contact.getContactType() == null) {
            contact.setContactType(EmergencyContact.ContactType.SECURITY);
        }
        return emergencyContactRepository.save(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyContact> updateContact(
            @PathVariable String id,
            @RequestBody EmergencyContact contactDetails) {

        EmergencyContact existingContact = emergencyContactRepository.findById(id)
                .orElse(null);
        if (existingContact == null) {
            return ResponseEntity.notFound().build();
        }

        existingContact.setName(contactDetails.getName());
        existingContact.setBlock(contactDetails.getBlock());
        existingContact.setPhoneNo(contactDetails.getPhoneNo());
        
        // Only update contactType if provided
        if (contactDetails.getContactType() != null) {
            existingContact.setContactType(contactDetails.getContactType());
        }

        EmergencyContact updatedContact = emergencyContactRepository.save(existingContact);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        if (!emergencyContactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        emergencyContactRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}