package com.healthlink.healthlink_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendVerificationEmail(String toEmail, String code) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

        String subject = "HealthLink - Verify Your Account";

        // Generate OTP boxes HTML
        StringBuilder otpHtml = new StringBuilder();
        for (char c : code.toCharArray()) {
            otpHtml.append(
                    "<div style=\"margin: 0 5px; width: 35px; height: 35px; border: 2px solid #e0e0e0; border-radius: 6px; background-color: #f8f9fa; color: #1976D2; font-size: 18px; font-weight: bold; line-height: 31px; text-align: center; display: inline-block;\">")
                    .append(c)
                    .append("</div>");
        }

        String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<body style=\"margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8;\">"
                +
                "  <table role=\"presentation\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">" +
                "    <tr>" +
                "      <td align=\"center\" style=\"padding: 40px 0;\">" +
                "        <div style=\"max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;\">"
                +
                "          <!-- Header -->" +
                "          <div style=\"background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid #f0f0f0;\">"
                +
                "            <img src='cid:fullLogo' alt='HealthLink' style='width: 160px; height: auto; display: block; margin: 0 auto;'/>"
                +
                "          </div>" +
                "          <!-- Body -->" +
                "          <div style=\"padding: 40px 30px; text-align: center;\">" +
                "            <h1 style=\"color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px; font-weight: 700;\">Verify Your Email</h1>"
                +
                "            <p style=\"color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;\">" +
                "              Thanks for signing up for HealthLink! <br/>Please use the OTP below to verify your account."
                +
                "            </p>" +
                "            <!-- OTP Container -->" +
                "            <div style=\"margin: 30px 0; text-align: center;\">" +
                otpHtml.toString() +
                "            </div>" +
                "            <p style=\"color: #666666; font-size: 14px; margin-top: 30px;\">" +
                "              This code expires in <b>2 minutes</b>." +
                "            </p>" +
                "          </div>" +
                "          <!-- Footer -->" +
                "          <div style=\"background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;\">"
                +
                "            <p style=\"color: #999999; font-size: 12px; margin: 0;\">" +
                "              If you didn't request this email, you can safely ignore it." +
                "            </p>" +
                "            <p style=\"color: #cccccc; font-size: 12px; margin: 10px 0 0 0;\">" +
                "              &copy; 2024 HealthLink. All rights reserved." +
                "            </p>" +
                "          </div>" +
                "        </div>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body>" +
                "</html>";

        helper.setText(htmlContent, true); // true = isHtml
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setFrom("healthlinkinfo2000@gmail.com");

        // Add the inline image
        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource(
                    "static/images/full_logo.png");
            helper.addInline("fullLogo", resource);
        } catch (Exception e) {
            System.err.println("Failed to attach logo: " + e.getMessage());
        }

        javaMailSender.send(mimeMessage);
    }

    public void sendWelcomeEmail(String toEmail, String name) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

        String subject = "Welcome to HealthLink! Next Steps";

        String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<body style=\"margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8;\">"
                +
                "  <table role=\"presentation\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">" +
                "    <tr>" +
                "      <td align=\"center\" style=\"padding: 40px 0;\">" +
                "        <div style=\"max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;\">"
                +
                "          <!-- Header -->" +
                "          <div style=\"background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid #f0f0f0;\">"
                +
                "            <img src='cid:fullLogo' alt='HealthLink' style='width: 160px; height: auto; display: block; margin: 0 auto;'/>"
                +
                "          </div>" +
                "          <!-- Body -->" +
                "          <div style=\"padding: 40px 30px; text-align: center;\">" +
                "            <h1 style=\"color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px; font-weight: 700;\">Welcome, "
                + name + "!</h1>"
                +
                "            <p style=\"color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;\">" +
                "              Your email has been successfully verified. We are thrilled to have you on board." +
                "            </p>" +
                "            <div style=\"background-color: #e3f2fd; border-left: 4px solid #1976D2; padding: 15px; text-align: left; margin: 30px 0;\">"
                +
                "               <h3 style=\"margin: 0 0 10px 0; color: #1565C0; font-size: 18px;\">🚀 Next Step: Complete Your Profile</h3>"
                +
                "               <p style=\"margin: 0; color: #555; font-size: 14px; line-height: 1.5;\">" +
                "                 To access the full potential of HealthLink, please complete the <b>Secondary Verification</b> (Profile Setup) in the app."
                +
                "               </p>" +
                "            </div>" +
                "            <p style=\"color: #666666; font-size: 16px; line-height: 1.5;\">" +
                "              We're here to help you manage your health journey with ease." +
                "            </p>" +
                "          </div>" +
                "          <!-- Footer -->" +
                "          <div style=\"background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;\">"
                +
                "            <p style=\"color: #999999; font-size: 12px; margin: 0;\">" +
                "              ©2025 HealthLink. All rights reserved." +
                "            </p>" +
                "          </div>" +
                "        </div>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body>" +
                "</html>";

        helper.setText(htmlContent, true); // true = isHtml
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setFrom("healthlinkinfo2000@gmail.com");

        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource(
                    "static/images/full_logo.png");
            helper.addInline("fullLogo", resource);
        } catch (Exception e) {
            System.err.println("Failed to attach logo: " + e.getMessage());
        }

        javaMailSender.send(mimeMessage);
    }
}
