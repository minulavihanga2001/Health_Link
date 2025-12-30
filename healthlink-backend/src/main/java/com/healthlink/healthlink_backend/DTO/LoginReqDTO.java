package com.healthlink.healthlink_backend.DTO;

import lombok.Data;

@Data
public class LoginReqDTO {
    private String email;
    private String password;
}
