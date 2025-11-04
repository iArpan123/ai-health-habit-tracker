package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.HabitActionLog;
import com.aihealth.ai_health_habit_tracker.repository.HabitActionLogRepository;
import com.theokanning.openai.completion.chat.*;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final HabitActionLogRepository logRepository;

    // Generates AI-powered feedback on user's habit patterns
    public String analyzeHabits(String userEmail) {
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            return "Missing OpenAI API key. Please configure OPENAI_API_KEY as an environment variable.";
        }

        List<HabitActionLog> logs = logRepository.findByUserEmailOrderByActionTimeAsc(userEmail);
        if (logs.isEmpty()) {
            return "No habit logs found for this user.";
        }

        // Format user habit logs into a readable summary
        StringBuilder sb = new StringBuilder();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (HabitActionLog log : logs) {
            sb.append(String.format(
                    "Habit: %s | Action: %s | Time: %s%n",
                    log.getHabitId(), // Using ID since habit name may not exist here
                    log.getAction(),
                    fmt.format(log.getActionTime())
            ));
        }

        // Build prompt for AI analysis
        String prompt = """
            You are an AI health coach analyzing a user's habit actions.
            Summarize their progress, consistency, and motivation level based on the logs.
            Provide 3 short paragraphs of insights and one motivational suggestion.
            
            Habit Activity:
            """ + sb;

        try {
            OpenAiService service = new OpenAiService(apiKey);

            ChatCompletionRequest req = ChatCompletionRequest.builder()
                    .model("gpt-4o-mini")
                    .messages(List.of(
                            new ChatMessage("system", "You are an encouraging and insightful health coach."),
                            new ChatMessage("user", prompt)
                    ))
                    .temperature(0.7)
                    .maxTokens(400)
                    .build();

            ChatCompletionResult result = service.createChatCompletion(req);
            return result.getChoices().get(0).getMessage().getContent();

        } catch (Exception e) {
            return "AI analysis failed: " + e.getMessage();
        }
    }
}
