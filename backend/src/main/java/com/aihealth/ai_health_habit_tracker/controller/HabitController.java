package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    // ✅ Fetch user habits
    @GetMapping
    public List<Habit> getHabits(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        return habitService.getHabits(email);
    }

    // ✅ Add new habit
    @PostMapping
    public Habit addHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                          @RequestBody Habit habit) {
        String email = jwt.getClaim("email");
        return habitService.createHabit(email, habit);
    }

    // ✅ Update habit (optional for later)
    @PutMapping("/{id}")
    public Habit updateHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                             @PathVariable Long id,
                             @RequestBody Habit updated) {
        String email = jwt.getClaim("email");
        return habitService.updateHabit(email, id, updated);
    }

    // ✅ Delete habit
    @DeleteMapping("/{id}")
    public void deleteHabit(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt,
                            @PathVariable Long id) {
        String email = jwt.getClaim("email");
        habitService.deleteHabit(id, email);
    }
}
