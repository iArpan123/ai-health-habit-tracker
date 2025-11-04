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

    private Long habitId;
    private String userEmail;
    private String action; // "done", "snooze", "skip"
    private Instant actionTime;

    @Column(length = 1000)
    private String notes;
}
