package com.healthlink.healthlink_backend.DTO;

import com.healthlink.healthlink_backend.model.Role;
import lombok.Data;

@Data
public class SignupReqDTO {
    private String name;
    private String email;
    private String password;
    private Role role;
}
