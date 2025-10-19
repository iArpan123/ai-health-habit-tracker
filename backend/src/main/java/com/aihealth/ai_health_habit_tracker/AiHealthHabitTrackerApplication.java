package com.aihealth.ai_health_habit_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AiHealthHabitTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiHealthHabitTrackerApplication.class, args);
	}

}
