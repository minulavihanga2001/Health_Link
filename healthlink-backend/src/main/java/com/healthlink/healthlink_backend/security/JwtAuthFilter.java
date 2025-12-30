package com.healthlink.healthlink_backend.security;

import com.healthlink.healthlink_backend.service.UserDetailServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailServiceImpl userDetailsService; // Your MongoDB lookup service

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Check for the Authorization Header (where the token is sent)
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // No token or incorrect format: Pass the request to the next filter
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract Token and Email
        jwt = authHeader.substring(7); // Remove "Bearer " prefix
        userEmail = jwtService.extractUsername(jwt); // Extract email from the token payload

        // 3. Validate Token and Authenticate
        // Check if the email is valid AND the user is not already authenticated in the context
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Fetch UserDetails (hashed password, authorities) from MongoDB
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Check if the token signature is valid and not expired
            if (jwtService.isTokenValid(jwt)) {

                // Create an authentication object using the validated UserDetails
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials are null because the token is the proof
                        userDetails.getAuthorities() // Authorities (Roles) are used for access control
                );

                // Add request details (IP, session info) to the token
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set the AuthenticationToken in the SecurityContext (User is now authenticated!)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 4. Continue the Filter Chain
        filterChain.doFilter(request, response);
    }
}
