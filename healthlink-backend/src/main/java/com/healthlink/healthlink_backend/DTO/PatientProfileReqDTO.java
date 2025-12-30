package com.healthlink.healthlink_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientProfileReqDTO {
    private String nic;
    private String mobileNumber;
    private LocalDate dob;
    private String gender;
    private String address;
    private java.util.List<String> allergies;
    private String maritalStatus;
    private String guardianName;
    private String guardianContact;
    private String profileImage;
    private String bloodGroup;
    private Double height;
    private Double weight;
}
