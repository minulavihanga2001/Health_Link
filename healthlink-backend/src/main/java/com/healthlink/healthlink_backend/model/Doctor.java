package com.healthlink.healthlink_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "doctors")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Doctor {
    @Id
    private String id;

    // Manual Reference: Links this specialized document to the core User identity
    // @Indexed ensures fast lookups and unique enforcement.
    @Indexed(unique = true)
    @Field("user_id")
    private String userId;

    @Indexed(unique = true)
    private String medicalRegNumber; // SLMC Registration Number
    private String specialization; // E.g., General Practitioner, Cardiologist
    private String hospitalAffiliation; // Optional, but useful
    private Boolean isCredentialsVerified = false;
}
