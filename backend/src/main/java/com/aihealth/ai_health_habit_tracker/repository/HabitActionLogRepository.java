package com.aihealth.ai_health_habit_tracker.repository;

import com.aihealth.ai_health_habit_tracker.entity.HabitActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitActionLogRepository extends JpaRepository<HabitActionLog, Long> {
    List<HabitActionLog> findByUserEmailOrderByActionTimeAsc(String userEmail);
}

