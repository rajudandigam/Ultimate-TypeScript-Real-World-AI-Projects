System Type: Agent  
Complexity: Level 2  
Industry: Education  
Capabilities: Matching  

# Peer Learning Group Matcher

## 🧠 Overview
An **assignment agent** that forms **study groups** by combining **availability**, **timezone**, **skill self-ratings**, **learning goals**, and **diversity/guardrail rules**—using tools to read **rosters** and output **group proposals** for instructor approval. It avoids **protected-attribute** use unless institution policy and **consent** explicitly allow; default path is **opt-in survey fields** only.

---

## 🎯 Problem
Random groups create free-rider dynamics and schedule conflicts; instructors lack time to optimize matches manually at scale.

---

## 💡 Why This Matters
- **Pain it removes:** Uneven groups, social isolation in online courses, and last-minute reshuffles.
- **Who benefits:** Instructors and TAs in large intro courses and bootcamps.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The agent can iterate on constraints (`try_partition`, `check_conflicts`) but final roster writes go through **LMS APIs** with approval.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Constraint solving + explanations; L3+ adds longitudinal performance-aware matching and richer fairness optimization with OR expertise.

---

## 🏭 Industry
Example:
- Education / collaborative learning

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — syllabus teamwork rubrics (optional)
- Planning — **in scope** (group formation plans)
- Reasoning — bounded (explain tradeoffs)
- Automation — LMS group creation (post-approval)
- Decision making — bounded (match quality scoring)
- Observability — **in scope**
- Personalization — student goals and prefs (survey-based)
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** orchestrator
- **OR-Tools** / constraint solver libs (TS or small Python sidecar)
- **OpenAI SDK** for NL intake → structured prefs JSON
- **Canvas/Blackburn/Moodle** groups APIs
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Survey responses, roster CSV, constraints (group size, min skill spread).
- **LLM layer:** Parses messy free-text goals into structured fields; proposes partitions with rationales.
- **Tools / APIs:** Roster fetch, calendar busy (if permitted), LMS group endpoints.
- **Memory (if any):** Prior term anonymized stats to tune weights (policy gated).
- **Output:** Group tables + conflict report + export to LMS draft.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Random shuffle within timezone buckets.

### Step 2: Add AI layer
- LLM explains a manually built table of groups for students.

### Step 3: Add tools
- Constraint solver for hard rules (no singleton timezones if avoidable).

### Step 4: Add memory or context
- Learn weights from instructor tweaks across weeks (feedback loop).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional mediator agent for student swap requests within rules.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Schedule conflict rate near zero; instructor acceptance of proposals.
- **Latency:** Time to produce groups for N=300 students.
- **Cost:** Solver CPU + small LLM for parsing surveys.
- **User satisfaction:** Student surveys on collaboration quality.
- **Failure rate:** Biased clustering, isolation of minority students, incorrect LMS writes.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented availability; only use structured survey/tool outputs.
- **Tool failures:** Missing roster fields; block auto-create until resolved.
- **Latency issues:** Hard combinatorial constraints; relax soft goals iteratively with transparency.
- **Cost spikes:** Many re-runs from changing prefs; freeze survey window then batch solve once.
- **Incorrect decisions:** Using sensitive attributes improperly; ethics review and explicit field bans.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log group ids and constraint versions, not sensitive student notes.
- **Observability:** Override reasons, swap request rates, post-course outcome correlations (aggregated).
- **Rate limiting:** Per course; protect LMS APIs from accidental loops.
- **Retry strategies:** Idempotent LMS group creation with mapping store.
- **Guardrails and validation:** Min/max group sizes; accessibility pairing requests honored.
- **Security considerations:** FERPA, consent for peer contact info exposure, data retention for surveys.

---

## 🚀 Possible Extensions

- **Add UI:** Drag-drop manual adjustments with live constraint satisfaction indicator.
- **Convert to SaaS:** Matching service for cohort-based programs.
- **Add multi-agent collaboration:** “Inclusion checker” agent with separate policy doc grounding.
- **Add real-time capabilities:** Handle late enrollments with minimal reshuffle algorithm.
- **Integrate with external systems:** Calendly-style student availability, Discord/Slack group creation.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **hard constraints + instructor approval** before auto-push to LMS.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Constraint-based** matching for people systems
  - **Fairness-aware** design in education
  - **LMS group** automation
  - **System design thinking** for collaborative classrooms
