package com.aihealth.ai_health_habit_tracker.repository;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserEmail(String userEmail);
}
