package com.healthlink.healthlink_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    private String bloodGroup;
    private String emergencyContactNumber;
    private String address;
    private String dateOfBirth;
    private String guardianName;
}
