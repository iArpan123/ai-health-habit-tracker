package com.aihealth.ai_health_habit_tracker.service;

import com.aihealth.ai_health_habit_tracker.entity.HabitActionLog;
import com.aihealth.ai_health_habit_tracker.repository.HabitActionLogRepository;
import com.theokanning.openai.completion.chat.*;
import com.theokanning.openai.service.OpenAiService;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final HabitActionLogRepository logRepository;

    public String analyzeHabits(String userEmail) {
        // Load from .env
        Dotenv dotenv = Dotenv.load();
        String apiKey = dotenv.get("OPENAI_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            return "❌ Missing OPENAI_API_KEY in .env file.";
        }

        List<HabitActionLog> logs = logRepository.findByUserEmailOrderByActionTimeAsc(userEmail);

        if (logs.isEmpty()) {
            return "No habit logs found for this user.";
        }

        StringBuilder sb = new StringBuilder();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (HabitActionLog log : logs) {
            sb.append(String.format(
                    "Habit: %s | Action: %s | Time: %s%n",
                    log.getHabitName(),
                    log.getActionType(),
                    fmt.format(log.getActionTime())
            ));
        }

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
                            new ChatMessage("system", "You are an encouraging health coach."),
                            new ChatMessage("user", prompt)
                    ))
                    .temperature(0.7)
                    .maxTokens(400)
                    .build();

            ChatCompletionResult result = service.createChatCompletion(req);
            return result.getChoices().get(0).getMessage().getContent();

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ AI analysis failed: " + e.getMessage();
        }
    }
}
