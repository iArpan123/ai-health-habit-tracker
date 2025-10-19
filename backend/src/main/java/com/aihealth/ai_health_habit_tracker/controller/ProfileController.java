package com.aihealth.ai_health_habit_tracker.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class ProfileController {

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "email", jwt.getClaim("email"),
                "sub", jwt.getClaim("sub"),
                "message", "Welcome " + jwt.getClaim("email")
        );
    }
}
