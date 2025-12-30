package com.healthlink.healthlink_backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PharmacistRegDTO {
    @NotBlank
    private String name;

    @Email
    private String email;

    @Size(min = 8)
    private String password;

    @NotBlank
    private String pharmacyLicenseNumber;

    @NotBlank
    private String pharmacyName;

    private String pharmacyBranchLocation;
}
