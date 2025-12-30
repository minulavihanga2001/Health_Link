package com.healthlink.healthlink_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String id;
    private String token;
    private String role;
    private String name;

    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;

    @com.fasterxml.jackson.annotation.JsonProperty("isVerificationComplete")
    private boolean isVerificationComplete;
}
