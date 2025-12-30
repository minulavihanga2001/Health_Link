package com.healthlink.healthlink_backend.DTO;

import lombok.Data;

@Data
public class PatientProfileDTO {

    private String bloodGroup;
    private String emergencyContactNumber;
    private String address;
    private String dateOfBirth;
    private String guardianName;
    private Double height;
    private Double weight;
    private String profileImage;
    // adding other fields to match User model fully if needed, but for now just
    // what's requested.
    // Actually, looking at the previous file content, it seems incomplete compared
    // to User.
    // Let's check PatientDataController to see how it constructs this DTO.
}
