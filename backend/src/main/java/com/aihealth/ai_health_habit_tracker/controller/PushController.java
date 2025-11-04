package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.entity.PushSubscription;
import com.aihealth.ai_health_habit_tracker.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/push")
@RequiredArgsConstructor
public class PushController {

    private final PushSubscriptionRepository repo;

    // Register a new push notification subscription for a user
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscription sub) {
        if (sub.getUserEmail() == null || sub.getEndpoint() == null) {
            return ResponseEntity.badRequest().body("Missing userEmail or endpoint");
        }

        // If an existing subscription with this endpoint exists, remove it first
        repo.findByEndpoint(sub.getEndpoint()).ifPresent(repo::delete);

        // Save the new subscription
        repo.save(sub);
        return ResponseEntity.ok("Subscription saved successfully");
    }
}
