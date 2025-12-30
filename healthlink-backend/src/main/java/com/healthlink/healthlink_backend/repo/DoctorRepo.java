package com.healthlink.healthlink_backend.repo;

import com.healthlink.healthlink_backend.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DoctorRepo extends MongoRepository<Doctor, String> {
    boolean existsByMedicalRegNumber(String medicalRegNumber);
    Optional<Doctor> findByUserId(String userId);
}
