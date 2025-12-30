package com.healthlink.healthlink_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordReqDTO {
    private String email;
    private String oldPassword;
    private String newPassword;
}
