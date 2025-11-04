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
@Table(name = "push_subscription")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "endpoint", nullable = false, length = 1024)
    private String endpoint;

    @Column(name = "p256dh", nullable = false, length = 512)
    private String p256dh;

    @Column(name = "auth", nullable = false, length = 512)
    private String auth;

    private Instant createdAt = Instant.now();
}
