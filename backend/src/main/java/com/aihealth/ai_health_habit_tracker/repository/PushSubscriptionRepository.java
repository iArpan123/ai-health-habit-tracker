package com.aihealth.ai_health_habit_tracker.repository;

import com.aihealth.ai_health_habit_tracker.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByEndpoint(String endpoint);
    List<PushSubscription> findByUserEmail(String userEmail);
}
