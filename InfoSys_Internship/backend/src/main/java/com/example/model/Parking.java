package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_lots")
public class Parking {
    
    @Id
    private String id;
    private String parkingId;
    private String flatNumber;
    private String block;
    private boolean isOccupied;
    private String assignedTo;
    
    // Constructors
    public Parking() {
    }
    
    public Parking(String parkingId, String flatNumber, String block, boolean isOccupied) {
        this.parkingId = parkingId;
        this.flatNumber = flatNumber;
        this.block = block;
        this.isOccupied = isOccupied;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getParkingId() {
        return parkingId;
    }
    
    public void setParkingId(String parkingId) {
        this.parkingId = parkingId;
    }
    
    public String getFlatNumber() {
        return flatNumber;
    }
    
    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }
    
    public String getBlock() {
        return block;
    }
    
    public void setBlock(String block) {
        this.block = block;
    }
    
    public boolean isOccupied() {
        return isOccupied;
    }
    
    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }
    
    public String getAssignedTo() {
        return assignedTo;
    }
    
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
    
    @Override
    public String toString() {
        return "Parking{" +
                "id='" + id + '\'' +
                ", parkingId='" + parkingId + '\'' +
                ", flatNumber='" + flatNumber + '\'' +
                ", block='" + block + '\'' +
                ", isOccupied=" + isOccupied +
                ", assignedTo='" + assignedTo + '\'' +
                '}';
    }
}

