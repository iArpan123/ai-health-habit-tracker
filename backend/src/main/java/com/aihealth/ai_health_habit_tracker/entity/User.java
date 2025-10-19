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

    @Column(unique = true, nullable = false)
    private String email;

    private String name;       // optional, can sync from Supabase
    private Instant createdAt = Instant.now();
}
