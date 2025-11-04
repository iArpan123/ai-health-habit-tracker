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

    // ✅ Your generated VAPID keys (keep safe)
    private static final String PUBLIC_KEY = "BFtp4YvlijAYkjlEDTe3qaKm4NiWRsA4pAuXFvk5dXT0D1pZnViS8SEesmIHtd4Srh1EaDGwtLgRjIAL0pRcauw";
    private static final String PRIVATE_KEY = "7QZzSdiSscRc_P2X3TNaYyX-QElO6VUGhjv4XUCtieM";

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public void sendHabitReminder(Habit habit) {
        try {
            PushService pushService = new PushService();
            pushService.setPublicKey(PUBLIC_KEY);
            pushService.setPrivateKey(PRIVATE_KEY);
            pushService.setSubject("mailto:you@example.com");

            String payload = String.format("""
                      {
  "habitId": %d,
  "habitName": "%s",
  "title": "Habit Reminder"
}
""", habit.getId(), habit.getName());



            List<PushSubscription> subs = pushRepo.findByUserEmail(habit.getUserEmail());
            for (PushSubscription sub : subs) {
                Notification notification = new Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        payload
                );
                pushService.send(notification);
                log.info("✅ Push notification sent to {} for habit {}", sub.getUserEmail(), habit.getName());
            }

        } catch (Exception e) {
            log.error("❌ Failed to send push notification for habit {}", habit.getName(), e);
        }
    }
}
