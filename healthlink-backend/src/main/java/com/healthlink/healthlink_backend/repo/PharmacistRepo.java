package com.healthlink.healthlink_backend.repo;

import com.healthlink.healthlink_backend.model.Pharmacist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PharmacistRepo extends MongoRepository<Pharmacist, String> {
    boolean existsByPharmacyLicenseNumber(String pharmacyLicenseNumber);
    Optional<Pharmacist> findByUserId(String userId);
}
