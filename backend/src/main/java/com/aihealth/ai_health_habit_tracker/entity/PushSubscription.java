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

    // Email of the user linked to this push subscription
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    // Endpoint URL provided by the browser’s Push API
    @Column(name = "endpoint", nullable = false, length = 1024)
    private String endpoint;

    // Public encryption key used for push message decryption
    @Column(name = "p256dh", nullable = false, length = 512)
    private String p256dh;

    // Authentication secret key for validating the push subscription
    @Column(name = "auth", nullable = false, length = 512)
    private String auth;

    // Timestamp when the subscription was created
    private Instant createdAt = Instant.now();
}
