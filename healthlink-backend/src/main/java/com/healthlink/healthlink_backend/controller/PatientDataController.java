package com.healthlink.healthlink_backend.controller;

import com.healthlink.healthlink_backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientDataController {
    private final com.healthlink.healthlink_backend.repo.UserRepo userRepo;

    @GetMapping("/{patientId}/records")

    @PreAuthorize("hasAuthority('PATIENT') and #patientId.equals(principal.id)")
    public ResponseEntity<String> getOwnRecords(@PathVariable String patientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        String message = String.format("Access granted for %s (Role: %s). Viewing records for ID: %s.",
                currentUser.getName(), currentUser.getRole().name(), patientId);

        return ResponseEntity.ok(message);
    }

    @org.springframework.web.bind.annotation.PostMapping("/complete-profile")
    public ResponseEntity<String> completeProfile(
            @org.springframework.web.bind.annotation.RequestBody com.healthlink.healthlink_backend.DTO.PatientProfileReqDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Update User Details
        currentUser.setNic(request.getNic());
        currentUser.setMobileNumber(request.getMobileNumber());
        currentUser.setDob(request.getDob());
        currentUser.setGender(request.getGender());
        currentUser.setAddress(request.getAddress());
        currentUser.setVerificationComplete(true);

        userRepo.save(currentUser);

        return ResponseEntity.ok("Profile completed successfully. You actived full potential of HealthLink.");
    }
}
