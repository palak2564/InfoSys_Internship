package com.example.controller;

import java.util.*;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.example.model.Resident;
import com.example.repository.ResidentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private ResidentRepository residentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            String residentId = request.get("residentId").toString();
            Double amount = Double.valueOf(request.get("amount").toString());
            
            Optional<Resident> residentOpt = residentRepository.findById(residentId);
            if (residentOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Resident not found"));
            }
            
            Resident resident = residentOpt.get();
            
            // Create Razorpay order
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 8));
            
            Order order = razorpayClient.orders.create(orderRequest);
            
            // Create response with everything needed for frontend
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("razorpayKeyId", razorpayKeyId);
            response.put("amount", (int)(amount * 100));
            response.put("currency", "INR");
            response.put("name", resident.getName());
            response.put("email", resident.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment order: " + e.getMessage()));
        }
    }
}