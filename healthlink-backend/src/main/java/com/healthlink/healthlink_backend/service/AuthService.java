package com.healthlink.healthlink_backend.service;

import com.healthlink.healthlink_backend.DTO.AuthResponseDTO;
import com.healthlink.healthlink_backend.DTO.ChangePasswordReqDTO;
import com.healthlink.healthlink_backend.DTO.LoginReqDTO;
import com.healthlink.healthlink_backend.DTO.SignupReqDTO;
import com.healthlink.healthlink_backend.model.Role;
import com.healthlink.healthlink_backend.model.User;
import com.healthlink.healthlink_backend.repo.UserRepo;
import com.healthlink.healthlink_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final SequenceService sequenceService;

    @org.springframework.transaction.annotation.Transactional
    public void signup(SignupReqDTO signupReq) {
        java.util.Optional<User> existingUserOpt = userRepo.findByEmail(signupReq.getEmail());

        User user;
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.isActive()) {
                throw new IllegalStateException("Email is already taken! Existing User ID: " + existingUser.getId()
                        + ", Active: " + existingUser.isActive());
            }
            // User exists but is not verified. Update details and resend OTP.
            user = existingUser;
            user.setName(signupReq.getName());
            user.setPassword(passwordEncoder.encode(signupReq.getPassword()));
            user.setRole(signupReq.getRole() != null ? signupReq.getRole() : Role.PATIENT);
        } else {
            // Create new user
            user = new User();
            user.setEmail(signupReq.getEmail());
            user.setPassword(passwordEncoder.encode(signupReq.getPassword()));
            user.setName(signupReq.getName());
            user.setRole(signupReq.getRole() != null ? signupReq.getRole() : Role.PATIENT);
            user.setActive(false);

            // Generate Health ID
            String rolePrefix;
            if (user.getRole() == Role.PATIENT) {
                rolePrefix = "HL-PNT";
            } else if (user.getRole() == Role.PHARMACIST) {
                rolePrefix = "HL-PHM";
            } else if (user.getRole() == Role.DOCTOR) {
                rolePrefix = "HL-DCT";
            } else {
                rolePrefix = "HL-USR";
            }
            int seq = sequenceService.getNextSequence(user.getRole().name());
            String healthId = String.format("%s%02d", rolePrefix, seq);
            user.setHealthId(healthId);
        }

        // Generate OTP
        String otp = generateVerificationCode();
        user.setVerificationCode(otp);
        user.setVerificationExpiresAt(java.time.LocalDateTime.now().plusMinutes(2));

        userRepo.save(user);

        // Send Email
        try {
            System.out.println("Sending verification email to: " + user.getEmail());
            emailService.sendVerificationEmail(user.getEmail(), otp);
            System.out.println("Email sent successfully.");
        } catch (jakarta.mail.MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send verification email");
        }

    }

    public AuthResponseDTO verifyUser(String email, String code) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isActive()) {
            throw new RuntimeException("User is already verified");
        }

        if (user.getVerificationExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        if (!user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Invalid verification code");
        }

        // Activate User
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiresAt(null);
        User savedUser = userRepo.save(user);

        // Send Welcome/Secondary Verification Email
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());
        } catch (jakarta.mail.MessagingException e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole());

        return new AuthResponseDTO(
                savedUser.getId(),
                token,
                savedUser.getRole().name(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getHealthId(),
                savedUser.isActive(),
                savedUser.isVerificationComplete());
    }

    public void resendVerificationCode(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isActive()) {
            throw new RuntimeException("User is already verified");
        }

        String otp = generateVerificationCode();
        user.setVerificationCode(otp);
        user.setVerificationExpiresAt(java.time.LocalDateTime.now().plusMinutes(2));
        userRepo.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), otp);
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException("Failed to send verification email");
        }
    }

    private String generateVerificationCode() {
        java.util.Random random = new java.util.Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public AuthResponseDTO login(LoginReqDTO request) {
        // Authenticates credentials using the AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // If authentication succeeds, retrieve user and generate token
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is not active. Please verify your email.");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponseDTO(
                user.getId(),
                token,
                user.getRole().name(),
                user.getName(),
                user.getEmail(),
                user.getHealthId(),
                user.isActive(),
                user.isVerificationComplete());
    }

    public void changePassword(ChangePasswordReqDTO request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
    }
}
