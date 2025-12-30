package com.healthlink.healthlink_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private boolean isActive = false;
    private String verificationCode;
    private java.time.LocalDateTime verificationExpiresAt;

    // Profile Fields
    private String nic;
    private String mobileNumber;
    private java.time.LocalDate dob;
    private String gender;
    private String address;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Maps the Role enum to Spring Security's authority format (e.g., ROLE_PATIENT)
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Email is the username for authentication
    }

    // Default UserDetails methods (set to true for simplicity)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
