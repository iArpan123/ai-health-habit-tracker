package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final HabitRepository habitRepository;

    // Runs every minute
    @Scheduled(cron = "0 * * * * *")
    public void checkReminders() {
        List<Habit> habits = habitRepository.findAll();

        LocalDateTime now = LocalDateTime.now();
        for (Habit habit : habits) {
            if (!habit.isActive()) continue;

            if (habit.getFrequency() == null) continue;

            switch (habit.getFrequency()) {
                case "hourly" -> {
                    if (habit.getLastCompletedAt() == null ||
                            Duration.between(habit.getLastCompletedAt(), Instant.now()).toHours() >= 1) {
                        triggerReminder(habit);
                    }
                }
                case "daily" -> {
                    if (habit.getReminderTime() != null) {
                        LocalTime nowTime = now.toLocalTime().withSecond(0).withNano(0);
                        if (nowTime.equals(habit.getReminderTime())) {
                            triggerReminder(habit);
                        }
                    }
                }
                case "weekly" -> {
                    if (habit.getReminderDays() != null && habit.getReminderDays().contains(now.getDayOfWeek())) {
                        LocalTime nowTime = now.toLocalTime().withSecond(0).withNano(0);
                        if (habit.getReminderTime() != null && nowTime.equals(habit.getReminderTime())) {
                            triggerReminder(habit);
                        }
                    }
                }
            }
        }
    }

    private void triggerReminder(Habit habit) {
        System.out.println("⏰ Reminder for habit: " + habit.getName() + " (" + habit.getUserEmail() + ")");
        // later: integrate with WebSocket → frontend notification
    }
}
