package com.example.controller;

import com.example.model.Payment;
import com.example.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/create")
    public Payment createPayment(@RequestBody Payment payment) {
        if ("Paid".equalsIgnoreCase(payment.getStatus())) {
            payment.setPaymentDate(new Date());
        }
        return paymentRepository.save(payment);
    }

    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
