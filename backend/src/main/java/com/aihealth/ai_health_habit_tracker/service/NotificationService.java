package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.Habit;
import com.aihealth.ai_health_habit_tracker.entity.PushSubscription;
import com.aihealth.ai_health_habit_tracker.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final PushSubscriptionRepository pushRepo;

    // VAPID keys should be stored in environment variables for security
    private static final String PUBLIC_KEY = System.getenv("VAPID_PUBLIC_KEY");
    private static final String PRIVATE_KEY = System.getenv("VAPID_PRIVATE_KEY");

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    // Sends a push notification reminder for a specific habit
    public void sendHabitReminder(Habit habit) {
        try {
            if (PUBLIC_KEY == null || PRIVATE_KEY == null) {
                log.warn("VAPID keys not configured. Push notifications will be skipped.");
                return;
            }

            PushService pushService = new PushService();
            pushService.setPublicKey(PUBLIC_KEY);
            pushService.setPrivateKey(PRIVATE_KEY);
            pushService.setSubject("mailto:support@example.com");

            // Build the payload message
            String payload = String.format("""
                    {
                        "habitId": %d,
                        "habitName": "%s",
                        "title": "Habit Reminder"
                    }
                    """, habit.getId(), habit.getName());

            // Send notifications to all subscriptions for this user
            List<PushSubscription> subs = pushRepo.findByUserEmail(habit.getUserEmail());
            for (PushSubscription sub : subs) {
                Notification notification = new Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        payload
                );
                pushService.send(notification);
                log.info("Push notification sent to {} for habit {}", sub.getUserEmail(), habit.getName());
            }

        } catch (Exception e) {
            log.error("Failed to send push notification for habit {}", habit.getName(), e);
        }
    }
}
