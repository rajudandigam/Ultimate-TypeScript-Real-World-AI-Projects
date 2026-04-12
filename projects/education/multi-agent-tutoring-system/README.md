System Type: Multi-Agent  
Complexity: Level 5  
Industry: Education  
Capabilities: Teaching, Adaptation  

# Multi-Agent Tutoring System

## 🧠 Overview
A **multi-agent tutoring runtime** with three roles—**explainer**, **evaluator**, and **feedback**—coordinated by a **supervisor** that owns session state, assessment rules, and safety policies. The design targets **high-stakes learning** where explanation, grading, and motivational feedback must be **separated**, **audited**, and **aligned** to the same rubric.

---

## 🎯 Problem
Monolithic tutoring bots mix teaching and grading incentives, producing overly lenient evaluations or confusing tone shifts. Production learning systems need **role separation**, **consistent rubrics**, and **traceable** decisions—especially when institutions require evidence for outcomes.

---

## 💡 Why This Matters
- **Pain it removes:** Inconsistent feedback, weak alignment between practice and assessment, and difficulty debugging “who said what” in long sessions.
- **Who benefits:** Credentialing programs, large online courses, and enterprise academies with QA requirements.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Multi-Agent System

**Explainer** optimizes for clarity; **evaluator** must be stricter and tool-backed where possible; **feedback** focuses on next actions without rewriting grades. The **supervisor** merges outputs into a coherent learner-visible timeline with **conflict resolution** when roles disagree.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Institutional tutoring at scale needs **access controls**, **session audit**, **content safety**, **evaluation harnesses**, and **human escalation** paths.

---

## 🏭 Industry
Example:
- Education (multi-role tutoring, large-scale online programs)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (curriculum, exemplar solutions—policy gated)
- Planning — **in scope** (session arc planning)
- Reasoning — **in scope**
- Automation — optional (LMS gradebook writes—human gated)
- Decision making — **in scope** (mastery updates, escalation)
- Observability — **in scope**
- Personalization — **in scope**
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React**
- **Node.js + TypeScript**
- **Temporal** (supervisor workflows, human review tasks)
- **OpenAI Agents SDK** / **Mastra**
- **Postgres** (session graph, rubric versions, audit)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Learner prompt, attempt artifacts, course policy id, proctoring mode flags.
- **LLM layer:** Explainer, evaluator, feedback agents with distinct tool registries; supervisor merges.
- **Tools / APIs:** Sandboxed execution, rubric fetch, similarity checks, LMS integration (scoped).
- **Memory (if any):** Session scratchpad + retrieval of allowed materials; strict TTL and consent.
- **Output:** Structured session transcript with role tags, scores, next tasks, and escalation markers.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single-agent tutor with fixed rubric snippets.

### Step 2: Add AI layer
- Add structured evaluation JSON separate from explanation stream.

### Step 3: Add tools
- Add sandbox and rubric tools; log tool outputs as evidence objects.

### Step 4: Add memory or context
- Add retrieval of exemplar mistakes and learning objectives (aggregated).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Split explainer/evaluator/feedback; add supervisor merge and dispute resolution policy.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Evaluator agreement with human graders on blind samples; learning gains on assessments.
- **Latency:** p95 session turn time under parallel agent budgets.
- **Cost:** Tokens per session vs educational outcomes achieved.
- **User satisfaction:** Learner motivation metrics; instructor trust in automated scores.
- **Failure rate:** Role contradictions, policy violations, LMS sync errors.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Evaluator invents rubric criteria; mitigated by tool-fetched rubric ids and mandatory citations.
- **Tool failures:** Sandbox instability; mitigated by isolating workers and circuit breakers.
- **Latency issues:** Three model calls per turn; mitigated by parallel where safe and strict budgets.
- **Cost spikes:** Long sessions; mitigated by summarization between turns with retained evidence ids.
- **Incorrect decisions:** Harmful feedback or biased grading; mitigated by moderation, bias testing, and human appeals.

---

## 🏭 Production Considerations

- **Logging and tracing:** Role-separated audit logs; PII minimization; configurable retention for minors.
- **Observability:** Disagreement rate between evaluator and human, escalation queue depth, tool error taxonomy.
- **Rate limiting:** Per learner and per institution; exam-mode throttles.
- **Retry strategies:** Bounded retries per agent; supervisor timeouts with safe user messaging.
- **Guardrails and validation:** Schema validation on merged output; block evaluator from seeing disallowed answer keys in secured modes.
- **Security considerations:** SSO, tenant isolation, proctoring integrations where applicable, SOC2-ready audit exports.

---

## 🚀 Possible Extensions

- **Add UI:** Instructor “merge dispute” console for conflicting role outputs.
- **Convert to SaaS:** Multi-tenant rubric marketplace with licensing.
- **Add multi-agent collaboration:** Add **proctoring signal** agent (privacy-sensitive—separate deployment).
- **Add real-time capabilities:** Voice mode with stricter policy and lower autonomy.
- **Integrate with external systems:** SIS, HRIS, badging.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Split roles only when measurement shows single-agent cannot meet integrity and UX targets.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multi-agent** pedagogy with explicit merge contracts
  - **Rubric-grounded** evaluation design
  - **Session auditing** for education products
  - **System design thinking** for high-stakes tutoring platforms
