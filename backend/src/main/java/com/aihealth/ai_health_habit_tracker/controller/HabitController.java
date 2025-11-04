package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.service.HabitService;
import com.aihealth.ai_health_habit_tracker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final NotificationService notificationService;

    // Get all habits for the authenticated user
    @GetMapping
    public List<Habit> getHabits(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        return habitService.getHabits(email);
    }

    // Create a new habit
    @PostMapping
    public Habit addHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                          @RequestBody Habit habit) {
        String email = jwt.getClaim("email");
        return habitService.createHabit(email, habit);
    }

    // Update an existing habit
    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                                             @PathVariable Long id,
                                             @RequestBody Habit updated) {
        String email = jwt.getClaim("email");
        Habit habit = habitService.updateHabit(email, id, updated);
        return ResponseEntity.ok(habit);
    }

    // Delete a specific habit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                                            @PathVariable Long id) {
        String email = jwt.getClaim("email");
        habitService.deleteHabit(id, email);
        return ResponseEntity.noContent().build();
    }

    // Toggle completion status for a habit
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Habit> toggleHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                                             @PathVariable Long id) {
        String email = jwt.getClaim("email");
        Habit habit = habitService.toggleHabit(id, email);
        return ResponseEntity.ok(habit);
    }

    // Snooze a habit for a short duration (e.g., 10 minutes)
    @PatchMapping("/{id}/snooze")
    public ResponseEntity<?> snooze(@PathVariable Long id) {
        return ResponseEntity.ok(habitService.snoozeHabit(id, 10));
    }

    // Skip a habit (mark as intentionally skipped)
    @PatchMapping("/{id}/skip")
    public ResponseEntity<?> skip(@PathVariable Long id) {
        habitService.skipHabit(id);
        return ResponseEntity.ok("Skipped");
    }

    // Manual test endpoint for push notifications
    @GetMapping("/{id}/test-notification")
    public ResponseEntity<String> testNotification(@PathVariable Long id) {
        try {
            Habit habit = habitService.getHabitById(id);
            if (habit == null) {
                return ResponseEntity.notFound().build();
            }
            notificationService.sendHabitReminder(habit);
            return ResponseEntity.ok("Test notification sent for habit: " + habit.getName());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send test notification");
        }
    }
}
