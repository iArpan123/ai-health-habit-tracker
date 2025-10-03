package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.config.JwtUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    @GetMapping("/profile")
    public String getProfile(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " from header
        String jwt = token.substring(7);
        String email = JwtUtil.extractUsername(jwt);
        return "Welcome, your email is: " + email;
    }
}
