package com.example.repository;

import com.example.model.Service;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {
    // Find services by user ID
    List<Service> findByUserId(String userId);

    // Find services by service type
    List<Service> findByServiceType(String serviceType);

    // Find services by status
    List<Service> findByStatus(Service.ServiceStatus status);

    // Find services by vendor company
    List<Service> findByVendorCompany(String vendorCompany);
}
