package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService aiService;

    @GetMapping("/analyze/{email}")
    public String analyzeHabits(@PathVariable String email) {
        return aiService.analyzeUserHabits(email);
    }
}
