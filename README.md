# 🧠💪 SmartHabit  
*Empowering consistency through AI-driven wellness insights.*

---

## 🌟 Overview  
**SmartHabit** is a full-stack wellness platform that helps users build and maintain healthy habits — from workouts and hydration to mindfulness and sleep.  
It combines a **React + Supabase** frontend with a **Spring Boot** backend, using **AI-powered habit analysis**, **push notifications**, and **real-time progress tracking** to improve user consistency and motivation.

---

## 🚀 Features  

### 💡 Core Functionality  
- **🔐 Supabase Authentication** — Secure signup/login with email & password  
- **🧱 Habit Management** — Create, edit, and delete custom habits (sleep, exercise, hydration, etc.)  
- **🔥 Streak Tracking** — Automatic habit streak counter for motivation  
- **🔔 Push Notifications** — Browser alerts for due or snoozed habits using Service Workers  
- **💬 Real-time Updates** — React dynamically refreshes habit data after user actions  

### 🤖 AI-Powered Insights  
- **OpenAI Integration (GPT-4-mini)** — Analyzes user habit logs to generate personalized insights  
- **Smart Summaries** — AI highlights consistency, motivation, and progress trends  
- **Motivational Coaching** — Provides daily encouragement and improvement suggestions  

### 🧩 Automation & System Design  
- **Spring Scheduler** — Background task runner for habit reminders  
- **Web Push (VAPID)** — Backend-to-browser push notifications  
- **MySQL + JPA** — Robust relational data model with automatic schema updates  
- **Dotenv-based Config** — Secure environment variable management  

---

## 🛠️ Tech Stack  

### ⚙️ Backend — Spring Boot  
- **Spring Boot 3.5** — RESTful API architecture  
- **Spring Security (JWT decoder)** — Validates Supabase-issued tokens  
- **JPA + Hibernate + MySQL** — ORM persistence and data management  
- **Web Push & Scheduler** — Automated notifications and reminders  
- **OpenAI API Client** — AI habit analysis and insights generation  

### 💻 Frontend — React  
- **React 18** — Fast, modular, and responsive UI  
- **Supabase Auth SDK** — Manages user sessions and authentication  
- **Axios API Client** — Handles secure backend communication  
- **Context API + Custom Hooks** — Clean and efficient state management  
- **Glassmorphic Dark Theme** — Modern design with smooth transitions and animations  

---

## 🔐 Authentication Flow  
1. User registers or logs in through **Supabase Auth**.  
2. Supabase returns an access token (JWT).  
3. The token is attached to each request via Axios interceptor.  
4. Spring Boot validates the JWT using **Supabase’s public key** for secure access control.  

---

## 🤖 AI Analysis Flow  
1. User habit logs are stored in MySQL.  
2. The backend sends logs to the **OpenAI API**.  
3. GPT-4 analyzes patterns and returns motivational insights like:  
   > “You’ve stayed consistent with hydration this week but skipped workouts on weekends — try adding a short morning stretch routine.”  

---

## 🔔 Notification Flow  
1. The frontend registers a **Service Worker** for push events.  
2. Backend uses **VAPID keys** to send Web Push notifications.  
3. Browser displays actionable reminders:  
   - ✅ *Mark Complete*  
   - 🕓 *Snooze 10 min*  
   - 🚫 *Skip for Today*  

---
