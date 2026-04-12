System Type: Agent  
Complexity: Level 4  
Industry: Education  
Capabilities: Planning, Personalization  

# AI Personalized Learning Path Generator

## 🧠 Overview
A **curriculum-aware agent** that builds a **structured learning roadmap** (modules, prerequisites, checkpoints) from a learner profile and goals, **updates** the plan as mastery signals arrive, and keeps outputs **grounded** in your organization’s syllabus graph—not a free-form study chat without assessable milestones.

---

## 🎯 Problem
Learners stall when paths are too rigid or too vague. Static roadmaps ignore prerequisites and time constraints; unstructured “AI plans” ignore **assessment integrity** and **licensed content boundaries**.

---

## 💡 Why This Matters
- **Pain it removes:** Drop-off after week one, mismatched difficulty curves, and admins manually rebuilding cohort plans.
- **Who benefits:** Bootcamps, enterprise academies, and credentialing programs that must show **measurable progression**.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Roadmap generation is a **graph-constrained planning** task with tools (`fetch_syllabus`, `fetch_assessment_results`, `propose_plan_patch`). One agent keeps **versioning** and **evaluation** simpler than multi-agent debates.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You are combining **personalization** with **structured planning** and typically integrating **LMS APIs** and analytics.

---

## 🏭 Industry
Example:
- Education (adaptive learning, cohort planning, skills platforms)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (syllabi, rubrics, prior cohort outcomes)
- Planning — **in scope**
- Reasoning — bounded (explain prerequisite choices)
- Automation — optional (sync milestones to LMS)
- Decision making — bounded (next module selection under constraints)
- Observability — **in scope**
- Personalization — **in scope**
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (learner + instructor views)
- **Node.js + TypeScript**
- **OpenAI Agents SDK** (structured plan patches)
- **Postgres** (learner graph state, plan versions)
- **LMS APIs** (Canvas/Moodle) optional
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Goal statement, time budget, diagnostic results, constraints (exam dates).
- **LLM layer:** Agent proposes `PlanPatch` operations against a canonical DAG schema.
- **Tools / APIs:** Read mastery scores, fetch module metadata, validate DAG acyclicity server-side.
- **Memory (if any):** Retrieve similar successful cohort paths (aggregated, privacy-safe).
- **Output:** Versioned roadmap artifact + export to LMS tasks.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static template paths per program track.

### Step 2: Add AI layer
- LLM fills ordering within a fixed module set with validation.

### Step 3: Add tools
- Wire mastery and attendance tools for evidence-based adjustments.

### Step 4: Add memory or context
- Retrieve exemplar roadmaps and instructor notes (ACL’d).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional evaluator agent only if you separate **assessment authoring** from **path planning** with strict boundaries.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Prerequisite correctness vs curriculum committee labels; completion lift vs control.
- **Latency:** Time to generate/update a plan for typical profiles.
- **Cost:** Tokens per learner per month at acceptable refresh cadence.
- **User satisfaction:** Learner NPS, instructor override rate.
- **Failure rate:** Invalid DAG patches, tool errors, inconsistent LMS sync.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented modules; mitigated by allowlists and server-side graph validation.
- **Tool failures:** LMS downtime; mitigated by offline mode with explicit stale markers.
- **Latency issues:** Large syllabus graphs; mitigated by pre-indexing and incremental patching.
- **Cost spikes:** Replanning on every micro-event; mitigated by debouncing and significance thresholds.
- **Incorrect decisions:** Pushing learners too fast/slow; mitigated by mastery thresholds and human review for high-stakes programs.

---

## 🏭 Production Considerations

- **Logging and tracing:** Plan version lineage; avoid logging minors’ sensitive details improperly (COPPA/FERPA awareness).
- **Observability:** Override reasons, stuck-learner detectors, sync failure rates.
- **Rate limiting:** Per org and per learner for replanning jobs.
- **Retry strategies:** Idempotent LMS writes; safe replays for analytics-only updates.
- **Guardrails and validation:** Schema validation; block edits to locked certification modules without role.
- **Security considerations:** SSO, least privilege LMS tokens, audit exports for accreditation reviews.

---

## 🚀 Possible Extensions

- **Add UI:** Drag-and-drop graph editor with validated operations only.
- **Convert to SaaS:** Multi-tenant curriculum packs with licensing metadata.
- **Add multi-agent collaboration:** Separate assessment design agent (human-gated publishes).
- **Add real-time capabilities:** Live replanning during tutoring sessions (bounded).
- **Integrate with external systems:** HRIS skill matrices, badging providers.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with graph validation; add intelligence where it measurably improves completion without harming fairness.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Curriculum graphs** as first-class data
  - **Structured plan patching** instead of free text
  - **LMS integration** realities
  - **System design thinking** for adaptive education at scale
