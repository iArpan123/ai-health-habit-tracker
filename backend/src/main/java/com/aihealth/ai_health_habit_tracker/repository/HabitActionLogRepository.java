package com.aihealth.ai_health_habit_tracker.repository;

import com.aihealth.ai_health_habit_tracker.entity.HabitActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitActionLogRepository extends JpaRepository<HabitActionLog, Long> {
}
