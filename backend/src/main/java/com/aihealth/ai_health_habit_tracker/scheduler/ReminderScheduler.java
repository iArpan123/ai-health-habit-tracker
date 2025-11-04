package com.aihealth.ai_health_habit_tracker.scheduler;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.repository.HabitRepository;
import com.aihealth.ai_health_habit_tracker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final HabitRepository habitRepository;
    private final NotificationService notificationService;

    // Runs every minute to check which habits are due
    @Scheduled(fixedRate = 60000)
    public void checkAndSendReminders() {
        Instant now = Instant.now();
        List<Habit> habits = habitRepository.findAll();

        for (Habit habit : habits) {
            if (!habit.isActive() || habit.isCompleted()) continue;

            if (habit.getNextReminderAt() != null &&
                    habit.getNextReminderAt().isBefore(now) &&
                    !habit.isNotificationSent()) {

                log.info("🔔 Sending reminder for habit {}", habit.getName());
                notificationService.sendHabitReminder(habit);

                habit.setNotificationSent(true);
                habitRepository.save(habit);
            }
        }
    }

}
