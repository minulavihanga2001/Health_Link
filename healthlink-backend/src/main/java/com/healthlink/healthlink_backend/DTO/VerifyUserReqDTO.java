package com.healthlink.healthlink_backend.DTO;

import lombok.Data;

@Data
public class VerifyUserReqDTO {
    private String email;
    private String verificationCode;
}
