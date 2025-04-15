package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emergency_contacts")
public class EmergencyContact {
    @Id
    private String id;
    private String name;
    private String block;
    private String phoneNo;
    private ContactType contactType;

    public enum ContactType {
        SECURITY, MEDICAL, FIRE, POLICE, OTHER
    }

    public EmergencyContact() {
    }

    public EmergencyContact(String id, String name, String block, String phoneNo, ContactType contactType) {
        this.id = id;
        this.name = name;
        this.block = block;
        this.phoneNo = phoneNo;
        this.contactType = contactType;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public ContactType getContactType() {
        return contactType;
    }

    public void setContactType(ContactType contactType) {
        this.contactType = contactType;
    }
}