# 🧠💪 AI Health & Habit Tracker  
*Empowering consistency through AI-driven wellness insights.*

---

## 🌟 Overview  
The **AI Health & Habit Tracker** is a full-stack wellness platform that helps users build and maintain healthy habits — from workouts and hydration to mindfulness and sleep.  
It combines a **React + Supabase** frontend with a **Spring Boot** backend, using **AI-powered habit analysis**, **push notifications**, and **real-time progress tracking** to improve user consistency and motivation.

---

## 🚀 Features  

### 💡 Core Functionality  
- **🔐 Supabase Authentication** — Secure signup/login with email & password (no custom JWTs needed)  
- **🧱 Habit Management** — Create, edit, and delete custom habits (sleep, exercise, hydration, etc.)  
- **🔥 Streak Tracking** — Automatic habit streak counter for motivation  
- **🔔 Push Notifications** — Browser alerts for due or snoozed habits using Service Workers  
- **💬 Real-time Updates** — React refreshes habit data dynamically after user actions  

### 🤖 AI-Powered Insights  
- **OpenAI Integration (GPT-4-mini)** — Analyzes user habit logs to generate personalized insights  
- **Smart Summaries** — AI summarizes consistency, motivation, and progress trends  
- **Motivational Coaching** — Daily encouragement and suggestions via natural-language generation  

### 🧩 Automation & System Design  
- **Spring Scheduler** — Background task runner for habit reminders  
- **Web Push (VAPID)** — Backend-to-browser push notifications  
- **MySQL + JPA** — Robust relational data model with automatic schema updates  
- **Dotenv-based Config** — Environment-safe secrets handling  

---

## 🛠️ Tech Stack  

### ⚙️ Backend — Spring Boot  
- **Spring Boot 3.5** — REST API architecture  
- **Spring Security (JWT decoder)** — Validates Supabase-issued tokens  
- **JPA + Hibernate + MySQL** — ORM persistence  
- **Web Push & Scheduler** — Automated notifications  
- **OpenAI API Client** — AI habit analysis  

### 💻 Frontend — React  
- **React 18 (CRA)** — Modular, fast, and responsive UI  
- **Supabase Auth SDK** — Handles user sessions and email/password flows  
- **Axios API Client** — Handles secure backend communication  
- **Context API + Custom Hooks** — Clean state management  
- **Glassmorphic Dark Theme** — Modern UI design with smooth animations  

---

## 🔐 Authentication Flow  
1. User registers or logs in via **Supabase Auth**.  
2. Supabase returns an access token (JWT).  
3. The token is attached to each request header automatically via Axios interceptor.  
4. Spring Boot backend validates the JWT using **Supabase’s public key** for secure access control.  

---

## 🤖 AI Analysis Flow  
1. User activity logs are stored in MySQL.  
2. The backend compiles and sends logs to the **OpenAI API**.  
3. GPT-4 analyzes the user’s habits and returns motivational summaries like:  
   > “You’ve been highly consistent with hydration this week but skipped workouts on weekends — try adding a short morning stretch routine.”  

---

## 🔔 Notification Flow  
1. The frontend registers a **Service Worker** for push events.  
2. Backend uses **VAPID keys** to send Web Push notifications.  
3. Browser displays actionable reminders:
   - ✅ *Mark Complete*  
   - 🕓 *Snooze 10 min*  
   - 🚫 *Skip for Today*  

---