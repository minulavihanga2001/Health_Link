package com.healthlink.healthlink_backend.controller;

import com.healthlink.healthlink_backend.model.User;
import com.healthlink.healthlink_backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow access from anywhere
public class PublicPatientController {

    private final UserRepo userRepo;

    @GetMapping(value = "/patient/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getPublicPatientProfile(@PathVariable String id) {
        Optional<User> userOpt = userRepo.findById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("<html><body style='font-family: sans-serif; text-align: center; padding: 50px;'><h1>Patient Not Found</h1></body></html>");
        }

        User user = userOpt.get();
        String htmlContent = generateHtmlProfile(user);
        return ResponseEntity.ok(htmlContent);
    }

    private String generateHtmlProfile(User user) {
        String base64Image = user.getProfileImage();
        String imageSrc = (base64Image != null && !base64Image.isEmpty())
                ? base64Image
                : "https://via.placeholder.com/150?text=" + user.getName().charAt(0);

        // Format DOB
        String dobParams = (user.getDob() != null)
                ? user.getDob().format(DateTimeFormatter.ISO_LOCAL_DATE)
                : "N/A";

        return """
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>HealthLink Profile: %s</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background: linear-gradient(135deg, #e0f2fe 0%%, #f0fdf4 100%%);
                                margin: 0;
                                min-height: 100vh;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                padding: 20px;
                            }
                            .card {
                                background: white;
                                border-radius: 20px;
                                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                                width: 100%%;
                                max-width: 400px;
                                overflow: hidden;
                                text-align: center;
                            }
                            .header {
                                background: #3b82f6;
                                padding: 30px 20px;
                                color: white;
                                position: relative;
                            }
                            .avatar-container {
                                width: 120px;
                                height: 120px;
                                border-radius: 50%%;
                                border: 5px solid white;
                                overflow: hidden;
                                margin: 0 auto -60px auto;
                                background: white;
                                position: relative;
                                top: 30px;
                                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            }
                            .avatar {
                                width: 100%%;
                                height: 100%%;
                                object-fit: cover;
                            }
                            .body {
                                padding: 70px 20px 30px 20px;
                            }
                            .name {
                                font-size: 24px;
                                font-weight: bold;
                                color: #1f2937;
                                margin-bottom: 5px;
                            }
                            .id {
                                font-size: 14px;
                                color: #6b7280;
                                margin-bottom: 20px;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            }
                            .verified-badge {
                                display: inline-block;
                                background: #dcfce7;
                                color: #166534;
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                            .details-grid {
                                text-align: left;
                                background: #f9fafb;
                                padding: 20px;
                                border-radius: 12px;
                            }
                            .detail-row {
                                margin-bottom: 12px;
                                border-bottom: 1px solid #e5e7eb;
                                padding-bottom: 8px;
                            }
                            .detail-row:last-child {
                                border-bottom: none;
                                margin-bottom: 0;
                            }
                            .label {
                                font-size: 11px;
                                color: #9ca3af;
                                text-transform: uppercase;
                                font-weight: bold;
                                display: block;
                                margin-bottom: 2px;
                            }
                            .value {
                                font-size: 15px;
                                color: #374151;
                                font-weight: 500;
                            }
                            .footer {
                                background: #f3f4f6;
                                padding: 15px;
                                font-size: 12px;
                                color: #9ca3af;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="header">
                                <h2>HealthLink</h2>
                            </div>
                            <div class="avatar-container">
                                <img src="%s" alt="Profile" class="avatar">
                            </div>
                            <div class="body">
                                <div class="name">%s</div>
                                <div class="id">ID: %s</div>
                                <div class="verified-badge">✔ Verified Patient</div>

                                <div class="details-grid">
                                    <div class="detail-row">
                                        <span class="label">Date of Birth</span>
                                        <span class="value">%s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Address</span>
                                        <span class="value">%s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Marital Status</span>
                                        <span class="value">%s</span>
                                    </div>
                                     <div class="detail-row">
                                        <span class="label">Guardian</span>
                                        <span class="value">%s</span>
                                    </div>
                                     <div class="detail-row">
                                        <span class="label">Guardian Contact</span>
                                        <span class="value">%s</span>
                                    </div>
                                </div>
                            </div>
                            <div class="footer">
                                Generated by HealthLink
                            </div>
                        </div>
                    </body>
                    </html>
                """.formatted(
                user.getName(),
                imageSrc,
                user.getName(),
                user.getId(),
                dobParams,
                user.getAddress() != null ? user.getAddress() : "N/A",
                user.getMaritalStatus() != null ? user.getMaritalStatus() : "N/A",
                user.getGuardianName() != null ? user.getGuardianName() : "N/A",
                user.getGuardianContact() != null ? user.getGuardianContact() : "N/A");
    }
}
