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



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Multi-Agent Tutoring System** (Multi-Agent, L5): prioritize components that match **multi** orchestration and the **education** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

### Open Source Building Blocks
- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.
- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node service + OpenAI Agents SDK + Postgres state store + Redis queue for async specialist work + OTel traces — fits handoff-heavy blueprints.
- **Lightweight:** Single Node process + in-memory queue for demos; still use Zod schemas and one Postgres schema for trip/issue graph state.
- **Production-heavy:** LangGraph for explicit graph control + dedicated worker pool per agent family + strict RBAC on tools + eval harness in CI.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

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
