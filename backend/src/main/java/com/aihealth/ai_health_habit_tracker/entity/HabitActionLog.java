package com.aihealth.ai_health_habit_tracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "habit_action_log")
public class HabitActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to the associated habit
    private Long habitId;

    // Email of the user who performed the action
    private String userEmail;

    // Type of action performed (e.g., "done", "snooze", "skip")
    private String action;

    // Timestamp of when the action occurred
    private Instant actionTime;

    // Optional notes or remarks related to this action
    @Column(length = 1000)
    private String notes;
}
