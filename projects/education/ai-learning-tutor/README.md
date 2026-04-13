System Type: Agent  
Complexity: Level 3  
Industry: Education  
Capabilities: Personalization, Reasoning  

# AI Learning Tutor

## 🧠 Overview
A **structured tutoring agent** that explains concepts, **adapts difficulty** based on assessed mastery signals, and maintains a **progress model** per learner—grounded in a **curriculum graph** (topics, prerequisites, exercises) rather than unconstrained chat that drifts off syllabus.

---

## 🎯 Problem
Self-serve learning breaks when content is too hard or too easy, or when learners get plausible-sounding but wrong explanations. Generic tutors also ignore **prerequisite order**, **assessment integrity**, and **content licensing**—all non-negotiable in real education products.

---

## 💡 Why This Matters
- **Pain it removes:** Stuck learners, shallow engagement metrics, and support load for basic “how do I start” questions.
- **Who benefits:** EdTech products, bootcamps, and internal enablement teams shipping **measurable** upskilling paths.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tutoring is a **continuous interaction** with one learner model state. A single agent with tools (`fetch_lesson`, `submit_quiz_attempt`, `fetch_prerequisite_graph`) keeps UX coherent and simplifies evaluation. Multi-agent is optional for separate **content safety** review pipelines, not for everyday tutoring turns.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Personalization requires **durable learner memory** (skills graph, error patterns) and **retrieval** over licensed curriculum chunks—not just a long system prompt.

---

## 🏭 Industry
Example:
- Education (EdTech, corporate learning, structured curricula)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (lesson snippets, worked examples)
- Planning — **in scope** (next best lesson / exercise selection)
- Reasoning — **in scope** (step-by-step explanations with checks)
- Automation — optional (schedule spaced repetition reminders)
- Decision making — bounded (mastery updates, remediation paths)
- Observability — **in scope**
- Personalization — **in scope**
- Multimodal — optional (diagrams, code execution sandbox)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (learner UI, interactive exercises)
- **Node.js + TypeScript**
- **OpenAI SDK** / **Vercel AI SDK** (streaming explanations + tool calls)
- **Postgres** (learner profiles, attempts, mastery estimates)
- **OpenTelemetry**
- **Optional:** isolated **WebAssembly/VM** runner for code exercises, not `eval` in prod

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Learning Tutor** (Agent, L3): prioritize components that match **agent** orchestration and the **education** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo.
- **Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it.
- **Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Learner message, current module id, optional assessment events from the client.
- **LLM layer:** Agent chooses teaching moves: explain, ask probing question, assign micro-exercise, or retrieve prerequisite content.
- **Tools / APIs:** Fetch lesson content, record attempt outcomes, fetch skill graph, schedule reviews.
- **Memory (if any):** Mastery vector per skill; spaced repetition schedule; RAG over corpus with license metadata.
- **Output:** Explanation stream + structured `next_step` for UI routing + updated mastery snapshot.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fixed lesson pages + static quizzes; no LLM.

### Step 2: Add AI layer
- LLM explains only within retrieved lesson chunks (citations required).

### Step 3: Add tools
- Tools to log attempts, fetch hints with decay, fetch prerequisite lessons.

### Step 4: Add memory or context
- Persist error patterns; personalize hint level and pacing.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional safety reviewer agent for public-facing courses with stricter moderation policies.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Explanation correctness vs educator rubric; assessment alignment with intended objectives.
- **Latency:** Time to first token and time to complete a tutoring turn under mobile constraints.
- **Cost:** Tokens per learning hour; cache hit rate for static curriculum retrieval.
- **User satisfaction:** Completion rates, qualitative learner feedback, support ticket reduction.
- **Failure rate:** Off-syllabus drift, tool errors, sandbox escapes (must be near zero).

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented theorems or APIs; mitigated by grounding in corpus and refusing when retrieval empty.
- **Tool failures:** LMS API outages; mitigated by graceful degradation to cached lessons.
- **Latency issues:** Long retrieval + rerank chains; mitigated by prefetch per module and aggressive caching.
- **Cost spikes:** Unlimited Socratic loops; mitigated by per-session budgets and pedagogy policies.
- **Incorrect decisions:** Advancing learners without mastery; mitigated by gated progression rules independent of LLM enthusiasm.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store pedagogy events, not just chat; COPPA/FERPA-style minimization where applicable.
- **Observability:** Mastery update metrics, refusal rates, content retrieval misses, sandbox failures.
- **Rate limiting:** Per learner and per classroom; anti-abuse for shared demo accounts.
- **Retry strategies:** Idempotent attempt logging; safe replays for analytics pipelines only.
- **Guardrails and validation:** Moderation for user-generated prompts; block disallowed topics per policy; content licensing tags enforced at retrieval.
- **Security considerations:** Sandboxed code execution; no leakage of other learners’ data; encryption at rest; regional residency.

---

## 🚀 Possible Extensions

- **Add UI:** Concept map visualization and spaced-repetition calendar.
- **Convert to SaaS:** Multi-tenant curriculum packs and educator authoring tools.
- **Add multi-agent collaboration:** Separate “assessment author” tooling vs runtime tutor.
- **Add real-time capabilities:** Live classroom mode with teacher oversight channel.
- **Integrate with external systems:** LMS (Canvas/Moodle), HRIS completion records.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with grounded explanations; add personalization only when measurement and privacy foundations exist.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Curriculum graphs** and gated progression
  - **Grounded tutoring** with citations to licensed content
  - **Mastery modeling** alongside LLM interactions
  - **System design thinking** for learner safety and pedagogy integrity
