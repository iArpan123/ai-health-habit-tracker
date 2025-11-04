package com.aihealth.ai_health_habit_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.Set;

@Entity
@Data
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String name;
    private String description;

    private String frequency;      // "hourly", "daily", "weekly", "custom"
    private LocalTime reminderTime; // for daily/weekly habits
    @ElementCollection
    private Set<DayOfWeek> reminderDays; // e.g. [MONDAY, WEDNESDAY]

    private boolean completed = false;
    private int streak = 0;
    private Instant lastCompletedAt;
    private boolean active = true;

    private Instant createdAt;
    private Instant nextReminderAt;
    private boolean notificationSent = false;

}
