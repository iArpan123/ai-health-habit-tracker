package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.entity.HabitActionLog;
import com.aihealth.ai_health_habit_tracker.repository.HabitActionLogRepository;
import com.aihealth.ai_health_habit_tracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitActionLogRepository logRepository;

    // ✅ Fetch all habits for a specific user
    public List<Habit> getHabits(String email) {
        return habitRepository.findByUserEmail(email);
    }

    // ✅ Create new habit
    public Habit createHabit(String email, Habit habit) {
        habit.setUserEmail(email);
        habit.setActive(true);
        habit.setNextReminderAt(calculateNextReminder(habit.getFrequency(), Instant.now()));
        return habitRepository.save(habit);
    }

    // ✅ Update existing habit
    public Habit updateHabit(String email, Long id, Habit updated) {
        Habit existing = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!existing.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to update this habit");
        }

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setFrequency(updated.getFrequency());
        existing.setReminderTime(updated.getReminderTime());
        existing.setReminderDays(updated.getReminderDays());
        existing.setActive(updated.isActive());

        return habitRepository.save(existing);
    }

    // ✅ Delete habit
    public void deleteHabit(Long id, String email) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this habit");
        }

        habitRepository.delete(habit);
    }

    // ✅ Toggle habit completion (and log it)
    public Habit toggleHabit(Long id, String email) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to modify this habit");
        }

        boolean newStatus = !habit.isCompleted();
        habit.setCompleted(newStatus);

        if (newStatus) {
            habit.setStreak(habit.getStreak() + 1);
            habit.setLastCompletedAt(Instant.now());
            habit.setNextReminderAt(calculateNextReminder(habit.getFrequency(), Instant.now()));
            habit.setNotificationSent(false);
            logAction(habit, email, "done", "User completed the habit");
        } else {
            habit.setNotificationSent(false);
            logAction(habit, email, "undo", "User unchecked completion");
        }

        return habitRepository.save(habit);
    }

    // ✅ Snooze habit
    public Habit snoozeHabit(Long id, int minutes) {
        Habit h = habitRepository.findById(id).orElseThrow();
        h.setNextReminderAt(Instant.now().plusSeconds(minutes * 60));
        h.setNotificationSent(false);
        logAction(h, h.getUserEmail(), "snooze", "User snoozed the reminder by " + minutes + " min");
        return habitRepository.save(h);
    }

    // ✅ Skip habit
    public void skipHabit(Long id) {
        Habit h = habitRepository.findById(id).orElseThrow();
        h.setNotificationSent(false);
        h.setNextReminderAt(calculateNextReminder(h.getFrequency(), Instant.now()));
        logAction(h, h.getUserEmail(), "skip", "User skipped the habit for now");
        habitRepository.save(h);
    }

    // ✅ Get habit by ID
    public Habit getHabitById(Long id) {
        return habitRepository.findById(id).orElse(null);
    }

    // ✅ Private helper
    private void logAction(Habit habit, String email, String action, String note) {
        HabitActionLog log = HabitActionLog.builder()
                .habitId(habit.getId())
                .userEmail(email)
                .action(action)
                .actionTime(Instant.now())
                .notes(note)
                .build();
        logRepository.save(log);
    }

    private Instant calculateNextReminder(String freq, Instant baseTime) {
        return switch (freq) {
            case "1m" -> baseTime.plusSeconds(60);
            case "1h" -> baseTime.plusSeconds(3600);
            case "1d" -> baseTime.plusSeconds(86400);
            case "1w" -> baseTime.plusSeconds(604800);
            default -> baseTime.plusSeconds(86400);
        };
    }
}
