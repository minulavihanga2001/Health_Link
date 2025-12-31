package com.healthlink.healthlink_backend.controller;

import com.healthlink.healthlink_backend.DTO.PatientProfileDTO;
import com.healthlink.healthlink_backend.model.User;
import com.healthlink.healthlink_backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final UserRepo userRepo;

    @GetMapping("/patient/{healthId}")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'PHARMACIST', 'PATIENT')")
    public ResponseEntity<PatientProfileDTO> getPatientByHealthId(@PathVariable String healthId) {
        // Try finding by HealthId first, fallback to ID if needed (though QR should
        // send healthId)
        User user = userRepo.findByHealthId(healthId)
                .or(() -> userRepo.findById(healthId))
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + healthId));

        PatientProfileDTO profile = PatientProfileDTO.builder()
                .nic(user.getNic())
                .mobileNumber(user.getMobileNumber())
                .dob(user.getDob() != null ? user.getDob().toString() : null)
                .gender(user.getGender())
                .address(user.getAddress())
                .allergies(user.getAllergies())
                .maritalStatus(user.getMaritalStatus())
                .guardianName(user.getGuardianName())
                .guardianContact(user.getGuardianContact())
                .profileImage(user.getProfileImage())
                .bloodGroup(user.getBloodGroup())
                .height(user.getHeight())
                .weight(user.getWeight())
                .build();

        return ResponseEntity.ok(profile);
    }
}
