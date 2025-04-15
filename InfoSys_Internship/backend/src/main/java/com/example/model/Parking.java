package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "parking_spaces")
public class Parking {
    @Id
    private String id;
    private String parkingId;      // Format: P-A234
    private String block;          // A, B, C, D, E, F
    private String flatNo;         // Associated Flat Number
    private String residentName;   // Name of the resident (optional)
    private boolean isOccupied;    // Occupation status
    
    // Default Constructor
    public Parking() {}

    // Parameterized Constructor
    public Parking(String parkingId, String block, String flatNo, String residentName, boolean isOccupied) {
        this.parkingId = parkingId;
        this.block = block;
        this.flatNo = flatNo;
        this.residentName = residentName;
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

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getFlatNo() {
        return flatNo;
    }

    public void setFlatNo(String flatNo) {
        this.flatNo = flatNo;
    }

    public String getResidentName() {
        return residentName;
    }

    public void setResidentName(String residentName) {
        this.residentName = residentName;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean isOccupied) {
        this.isOccupied = isOccupied;
    }
}