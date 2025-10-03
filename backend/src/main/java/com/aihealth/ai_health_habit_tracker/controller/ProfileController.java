package com.aihealth.ai_health_habit_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import com.aihealth.ai_health_habit_tracker.security.JwtUtil;

import java.util.HashMap;
import java.util.Map;


@RestController
public class ProfileController {

    private final JwtUtil jwtUtil;

    @Autowired
    public ProfileController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public Map<String, String> getProfile(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String jwt = token.substring(7); // remove "Bearer "
        String email = jwtUtil.extractUsername(jwt);

        Map<String, String> response = new HashMap<>();
        response.put("email", email);
        return response;
    }
}
