package com.healthlink.healthlink_backend.repo;

import com.healthlink.healthlink_backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepo extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByHealthId(String healthId);

    boolean existsByEmail(String email);
}
