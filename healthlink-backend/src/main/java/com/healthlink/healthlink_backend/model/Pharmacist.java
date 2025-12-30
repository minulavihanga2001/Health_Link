package com.healthlink.healthlink_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "pharmacists")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pharmacist {

    @Id
    private String id;

    // Manual Reference: Links this specialized document to the core User identity
    @Indexed(unique = true)
    @Field("user_id")
    private String userId;

    @Indexed(unique = true)
    private String pharmacyLicenseNumber; // Pharmacy Council License Number

    private String pharmacyName;

    private String pharmacyBranchLocation;

    private Boolean isCredentialsVerified = false; // Flag for manual admin/system verification
}
