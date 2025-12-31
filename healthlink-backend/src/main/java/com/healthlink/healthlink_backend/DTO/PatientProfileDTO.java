package com.healthlink.healthlink_backend.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientProfileDTO {
    private String nic;
    private String mobileNumber;
    private String dob;
    private String gender;
    private String address;
    private List<String> allergies;
    private String maritalStatus;
    private String guardianName;
    private String guardianContact;
    private String profileImage;
    private String bloodGroup;
    private Double height;
    private Double weight;
}
