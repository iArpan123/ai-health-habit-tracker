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

    // Email of the user who owns this habit
    private String userEmail;

    // Basic habit details
    private String name;
    private String description;

    // Frequency type (e.g., "daily", "weekly", "custom")
    private String frequency;

    // Reminder time for daily or weekly habits
    private LocalTime reminderTime;

    // Days of the week to send reminders (for weekly habits)
    @ElementCollection
    private Set<DayOfWeek> reminderDays;

    // Habit progress and state tracking
    private boolean completed = false;
    private int streak = 0;
    private Instant lastCompletedAt;
    private boolean active = true;

    // Metadata and scheduling
    private Instant createdAt;
    private Instant nextReminderAt;
    private boolean notificationSent = false;
}
