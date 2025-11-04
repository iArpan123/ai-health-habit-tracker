package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final HabitRepository habitRepository;

    // Scheduled job that runs every minute to check for habits that need reminders
    @Scheduled(cron = "0 * * * * *")
    public void checkReminders() {
        List<Habit> habits = habitRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Habit habit : habits) {
            if (!habit.isActive() || habit.getFrequency() == null) continue;

            switch (habit.getFrequency()) {
                case "hourly" -> handleHourlyReminder(habit);
                case "daily" -> handleDailyReminder(habit, now);
                case "weekly" -> handleWeeklyReminder(habit, now);
                default -> {
                    // Unknown frequency types are simply skipped
                }
            }
        }
    }

    // Handles hourly habit reminders
    private void handleHourlyReminder(Habit habit) {
        if (habit.getLastCompletedAt() == null ||
                Duration.between(habit.getLastCompletedAt(), Instant.now()).toHours() >= 1) {
            triggerReminder(habit);
        }
    }

    // Handles daily habit reminders
    private void handleDailyReminder(Habit habit, LocalDateTime now) {
        if (habit.getReminderTime() != null) {
            LocalTime nowTime = now.toLocalTime().withSecond(0).withNano(0);
            if (nowTime.equals(habit.getReminderTime())) {
                triggerReminder(habit);
            }
        }
    }

    // Handles weekly habit reminders
    private void handleWeeklyReminder(Habit habit, LocalDateTime now) {
        if (habit.getReminderDays() != null && habit.getReminderDays().contains(now.getDayOfWeek())) {
            LocalTime nowTime = now.toLocalTime().withSecond(0).withNano(0);
            if (habit.getReminderTime() != null && nowTime.equals(habit.getReminderTime())) {
                triggerReminder(habit);
            }
        }
    }

    // Logs or dispatches reminders (future: integrate with WebSocket or push notifications)
    private void triggerReminder(Habit habit) {
        log.info("Reminder triggered for habit '{}' (user: {})", habit.getName(), habit.getUserEmail());
    }
}
