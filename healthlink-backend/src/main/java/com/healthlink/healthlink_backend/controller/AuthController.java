package com.healthlink.healthlink_backend.controller;

import com.healthlink.healthlink_backend.DTO.AuthResponseDTO;
import com.healthlink.healthlink_backend.DTO.ChangePasswordReqDTO;
import com.healthlink.healthlink_backend.DTO.LoginReqDTO;
import com.healthlink.healthlink_backend.DTO.SignupReqDTO;
import com.healthlink.healthlink_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupReqDTO request) {
        authService.signup(request);
        return new ResponseEntity<>("User registered successfully. Please verify your email.", HttpStatus.CREATED);
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponseDTO> verifyUser(
            @RequestBody com.healthlink.healthlink_backend.DTO.VerifyUserReqDTO request) {
        AuthResponseDTO response = authService.verifyUser(request.getEmail(), request.getVerificationCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        authService.resendVerificationCode(email);
        return ResponseEntity.ok("Verification code resent successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginReqDTO request) {
        AuthResponseDTO response = authService.login(request);
        // The response contains the token and the user's role (PATIENT, DOCTOR, etc.)
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordReqDTO request) {
        authService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully.");
    }
}
