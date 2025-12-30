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
}
