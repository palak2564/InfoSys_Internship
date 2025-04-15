package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "guards")
public class Guard {

    @Id
    private String id;
    private String name;
    private String block;
    private String phoneNo;  // Ensure it's phoneNo, not phone.

    public Guard() {}

    public Guard(String name, String block, String phoneNo) {
        this.name = name;
        this.block = block;
        this.phoneNo = phoneNo;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBlock() {
        return block;
    }

    public String getPhoneNo() {  // Ensure getter is named phoneNo
        return phoneNo;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public void setPhoneNo(String phoneNo) {  // Ensure setter is named phoneNo
        this.phoneNo = phoneNo;
    }
}
