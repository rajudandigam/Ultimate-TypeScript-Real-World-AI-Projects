System Type: Agent  
Complexity: Level 2  
Industry: Family / Parenting  
Capabilities: Planning  

# School Morning Routine Planner

## 🧠 Overview
Builds a **calibrated morning timeline** for school days: **wake time → breakfast → teeth → backpack checks → out the door**, using **weather** (jacket layer), **school calendar** (early dismissal), and **each child’s pace** learned from history. Sends **staged reminders** (watch, speaker, parent phone) without nagging spirals.

---

## 🎯 Problem
Mornings are chaotic; generic alarms ignore bus timing, missing library books, or a slow eater; parents become the human snooze button.

---

## 💡 Why This Matters
- **Pain it removes:** Tardy stress and forgotten gear.
- **Who benefits:** Parents with multiple kids and different school start times.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **structured schedule tools** and **workflow** for reliable push notifications.

---

## ⚙️ Complexity Level
**Target:** Level 2 — mostly scheduling + templates with light personalization.

---

## 🏭 Industry
Family / edtech-adjacent consumer

---

## 🧩 Capabilities
Planning, Personalization, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js or Flutter, Node.js, Postgres household profiles, Google/Apple Calendar sync, weather API, FCM/APNs, OpenAI SDK for short kid-friendly copy, OpenTelemetry

---

## 🧱 High-Level Architecture
School night “prep check” ping → morning plan generated → countdown notifications → **catch-up mode** if a step slips → end-of-morning feedback (optional one tap)

---

## 🔄 Implementation Steps
1. Fixed template per child  
2. Add bus stop ETA tool  
3. Backpack photo checklist (optional, privacy-first)  
4. Sibling stagger (younger wakes later)  
5. Teacher early-late import via ICS  

---

## 📊 Evaluation
On-time departure rate (self-report), reminder dismiss vs act rate, parent-perceived stress score (light survey)

---

## ⚠️ Challenges & Failure Cases
**Over-notification** causing kids to ignore; wrong calendar timezone; **COPPA** if child accounts—rate caps, school timezone rules, parent-gated devices only, no social features by default

---

## 🏭 Production Considerations
DND respect on parent phones, accessibility (non-reading kids: icon prompts), multilingual household support

---

## 🚀 Possible Extensions
After-school handoff block (snack → homework) using same engine

---

## 🔁 Evolution Path
Static checklist → personalized durations → agent-tuned plans with weekly retro

---

## 🤖 Agent breakdown
- **Estimator tool:** learns per-step durations from completion timestamps.  
- **Planner agent:** assembles ordered steps with buffers and “if late, skip optional” branches.  
- **Copy agent (micro):** rewrites reminders in supportive tone within strict length limits.

---

## 🎓 What You Learn
Notification UX for families, tiny-data personalization, calendar edge cases
