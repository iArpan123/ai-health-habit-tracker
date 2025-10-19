package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;

    // ✅ Fetch all habits for a specific user
    public List<Habit> getHabits(String email) {
        return habitRepository.findByUserEmail(email);
    }

    // ✅ Create a new habit and associate it with user
    public Habit createHabit(String email, Habit habit) {
        habit.setUserEmail(email);
        habit.setActive(true);
        habit.setCreatedAt(Instant.now());
        return habitRepository.save(habit);
    }

    // ✅ Update existing habit (optional for later)
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

    // ✅ Delete a habit
    public void deleteHabit(Long id, String email) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this habit");
        }

        habitRepository.delete(habit);
    }
}
