package com.healthlink.healthlink_backend.DTO;

import lombok.Data;

@Data
public class PatientProfileDTO {

    private String bloodGroup;
    private String emergencyContactNumber;
    private String address;
    private String dateOfBirth;
    private String guardianName;
}
