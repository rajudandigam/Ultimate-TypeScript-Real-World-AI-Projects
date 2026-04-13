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



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **School Morning Routine Planner** (Agent, L2): prioritize components that match **agent** orchestration and the **family** integration surface.

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
