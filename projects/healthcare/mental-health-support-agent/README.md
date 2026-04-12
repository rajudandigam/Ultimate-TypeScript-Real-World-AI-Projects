System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Conversational, Monitoring  

# Mental Health Support Agent

## 🧠 Overview
**CBT-style structured support** chat with **guardrails**, **session limits**, and **mandatory crisis escalation** (hotlines, emergency services routing by region)—**not** therapy replacement, **not** diagnosis, and **not** for acute crisis without human safety pathways. Product/legal/clinical oversight required.

---

## 🎯 Problem
Access gaps; unsafe generic chatbots. Need **policy packs**, **risk classifiers**, and **human handoff**.

---

## 🏗️ System Type
**Chosen:** Single Agent with **hard-coded** escalation tools (`assess_risk_score` from separate safety model, `connect_crisis_resources`).

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Healthcare / digital mental health (regulated).

---

## 🧩 Capabilities
Conversational, Monitoring, Personalization (bounded), Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Postgres** sessions, safety classifier service, **OpenAI SDK** with refusal policies, **OpenTelemetry**.

---

## 🧱 High-Level Architecture
Client → BFF → agent → content moderation + crisis router → audit; optional human therapist dashboard.

---

## 🔄 Implementation Steps
Scripted psychoeducation → LLM within CBT outlines → risk scoring → escalation playbooks.

---

## 📊 Evaluation
Clinical advisor review rubrics, harmful output rate (must be ~0), escalation appropriateness on labeled scenarios.

---

## ⚠️ Challenges & Failure Cases
**Self-harm** missed—multi-layer detection + conservative escalation. **Dependency** on model for crisis—never; rules first. **Privacy** breaches—encrypt sessions.

---

## 🏭 Production Considerations
Crisis resource accuracy by locale, age gating, licensure claims, malpractice insurance, retention limits, abuse reporting.

---

## 🚀 Possible Extensions
Therapist async messaging integration (HIPAA), journaling with consent.

---

## 🔁 Evolution Path
Psychoeducation only → guided CBT modules → optional licensed telehealth bridge.

---

## 🎓 What You Learn
Safety engineering for conversational health, escalation UX, ethics-by-design.
