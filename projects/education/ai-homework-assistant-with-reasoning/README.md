System Type: Agent  
Complexity: Level 3  
Industry: Education  
Capabilities: Reasoning  

# AI Homework Assistant with Reasoning

## 🧠 Overview
A **step-by-step tutoring agent** that helps learners work through problems with **Socratic hints**, **verified calculations** where applicable, and **explicit policy** for how much direct help is allowed per assignment type—aimed at learning outcomes, not answer laundering.

---

## 🎯 Problem
Homework help products swing between useless hints and full solutions that enable academic dishonesty. Schools need **pedagogy-aware** systems with **integrity controls**, **course policy** integration, and **auditability** of what was shown to whom.

---

## 💡 Why This Matters
- **Pain it removes:** Cheating risk, inconsistent tutoring quality, and overloaded TAs for repetitive questions.
- **Who benefits:** EdTech providers selling to institutions, and internal training teams with compliance requirements.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

A tutoring session is a **single thread** with tools (`run_sandbox_math`, `fetch_rubric`, `check_similar_problem`). Multi-agent is rarely needed unless isolating **content moderation** as a separate service.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. The product is **reasoning + tools** with optional retrieval of **licensed** course materials—not full multi-agent orchestration.

---

## 🏭 Industry
Example:
- Education (STEM tutoring, test prep, institutional study aids)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (textbook excerpts, instructor-provided solutions bank—policy gated)
- Planning — light (step plan scaffolding)
- Reasoning — **in scope**
- Automation — optional (submit draft to LMS—usually off)
- Decision making — bounded (when to reveal next hint tier)
- Observability — **in scope**
- Personalization — optional (pace preferences)
- Multimodal — optional (diagram OCR)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (student workspace)
- **Node.js + TypeScript**
- **OpenAI SDK** (structured step output)
- **Sandboxed WASM/VM** for numeric/code checks where appropriate
- **Postgres** (session logs, policy profiles)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Homework Assistant with Reasoning** (Agent, L3): prioritize components that match **agent** orchestration and the **education** integration surface.

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

- **Input (UI / API / CLI):** Problem text, course id, assignment policy (`hints_only`, `graded`, etc.).
- **LLM layer:** Agent emits structured steps with `hint_level` and optional `student_check_question`.
- **Tools / APIs:** Calculator/symbolic engine, code runner (sandboxed), similarity check vs instructor corpus.
- **Memory (if any):** Short session memory; retrieval only from allowed corpora.
- **Output:** Step stream + final reflection prompts; integrity metadata for instructors.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fixed hint ladder per template problems.

### Step 2: Add AI layer
- LLM generates hints with increasing strength capped by policy.

### Step 3: Add tools
- Add sandbox execution to validate intermediate steps for STEM.

### Step 4: Add memory or context
- Retrieve similar problems and common mistake patterns (aggregated).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional moderation microservice for user prompts (non-chat multi-agent pattern).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Step correctness vs TA rubric; reduction in final-error rate on practice sets.
- **Latency:** Time to first helpful hint under mobile constraints.
- **Cost:** Tokens per resolved problem; sandbox CPU minutes.
- **User satisfaction:** Learner confidence surveys; instructor trust scores.
- **Failure rate:** Integrity violations (full solutions when disallowed), sandbox escapes (must be ~0).

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong theorem or code; mitigated by sandbox checks and “verify” prompts with tool-backed validation.
- **Tool failures:** Sandbox timeouts; mitigated by graceful degradation to hints only.
- **Latency issues:** Long chain-of-thought; mitigated by streaming and step budgets.
- **Cost spikes:** Re-running full solutions; mitigated by per-session caps and caching similar subproblems.
- **Incorrect decisions:** Enabling cheating; mitigated by course policy engine, similarity detection, and instructor dashboards.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store policy version and hint levels; minimize storing full student submissions if not allowed.
- **Observability:** Integrity flags, moderation blocks, sandbox crash rates.
- **Rate limiting:** Per student and per IP; exam window lockdown modes.
- **Retry strategies:** Safe retries for tool calls; no duplicate LMS submissions.
- **Guardrails and validation:** Block disallowed requests (exam codes); age-appropriate content filters where required.
- **Security considerations:** Sandboxed execution isolation; content scanning; FERPA/COPPA-aware retention.

---

## 🚀 Possible Extensions

- **Add UI:** Instructor review of flagged sessions with replay.
- **Convert to SaaS:** Institution-wide policy packs and LMS SSO.
- **Add multi-agent collaboration:** Separate “grader” tool-only agent for practice mode.
- **Add real-time capabilities:** Voice tutoring with stricter policy controls.
- **Integrate with external systems:** Plagiarism tools where institutionally approved.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Add autonomy only as integrity monitoring proves the system stays within policy.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Pedagogy-first** tool design
  - **Academic integrity** engineering
  - **Sandboxed verification** for STEM
  - **System design thinking** for responsible tutoring products
