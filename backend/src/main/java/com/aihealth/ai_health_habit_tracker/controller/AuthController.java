package com.aihealth.ai_health_habit_tracker.controller;

import com.aihealth.ai_health_habit_tracker.model.User;
import com.aihealth.ai_health_habit_tracker.repository.UserRepository;
import com.aihealth.ai_health_habit_tracker.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> dbUser = userRepository.findByEmail(user.getEmail());
        if (dbUser.isPresent() && passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            return JwtUtil.generateToken(user.getEmail());
        }
        return "Invalid credentials!";
    }
}
