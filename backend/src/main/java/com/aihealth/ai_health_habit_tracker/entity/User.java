package com.aihealth.ai_health_habit_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique email address of the user
    @Column(unique = true, nullable = false)
    private String email;

    // Optional display name, can be synced from external auth provider
    private String name;

    // Timestamp for when the user account was created
    private Instant createdAt = Instant.now();
}
