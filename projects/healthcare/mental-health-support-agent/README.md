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



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Mental Health Support Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

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
