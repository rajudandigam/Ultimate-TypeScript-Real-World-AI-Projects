System Type: Agent  
Complexity: Level 3  
Industry: Personal AI / Home Ops  
Capabilities: Prediction  

# Home Maintenance Intelligence System

## 🧠 Overview
Keeps a **digital twin of home assets** (HVAC, roof, water heater, appliances, filters) with **seasonal schedules**, **warranty docs**, and **local climate risk**—a **maintenance agent** predicts **what is due soon**, flags **risk patterns** (e.g., humidity + age of water heater), and proposes **actionable tickets** (DIY steps or pro dispatch links).

---

## 🎯 Problem
Homeowners forget filter swaps until the furnace struggles; small leaks become big bills; warranties expire unnoticed.

---

## 💡 Why This Matters
- **Pain it removes:** Reactive emergency repairs and opaque service upsells.
- **Who benefits:** New homeowners, landlords with a few doors, and busy renters with delegated chores.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **structured home model tools** + **reminder workflows**; predictions combine **rules + simple ML** with LLM for **plain-language rationales** tied to rows.

---

## ⚙️ Complexity Level
**Target:** Level 3 — longitudinal data, multi-asset graph, and notification hygiene.

---

## 🏭 Industry
Personal / property ops

---

## 🧩 Capabilities
Prediction, Monitoring, Automation, Planning, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres (assets + service history), Temporal reminders, OpenAI SDK, document upload to S3, weather API for freeze-pipe risk, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Home Maintenance Intelligence System** (Agent, L3): prioritize components that match **agent** orchestration and the **personal-ai** integration surface.

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
Onboarding wizard → asset graph → **Maintenance Agent** scores risk + due dates → calendar + push → completion feedback improves estimates

---

## 🔄 Implementation Steps
1. Static seasonal checklist by home age band  
2. Per-asset service log with receipt OCR  
3. Warranty expiry alerts  
4. Integrate smart thermostat humidity (optional)  
5. Vendor-neutral “scope of work” blurbs for quotes  

---

## 📊 Evaluation
Tasks completed on time %, emergency incident rate vs control cohort (self-report), false alert rate per asset class

---

## ⚠️ Challenges & Failure Cases
**Wrong model year** leads to wrong part; **overconfident failure prediction** scares users—confidence bands, “verify with pro” flags, never claim insurance outcomes, user-editable asset facts are source of truth

---

## 🏭 Production Considerations
Landlord vs tenant permissions, liability disclaimers, secure doc storage, multi-home switching, export for home sale disclosure prep (user-initiated)

---

## 🚀 Possible Extensions
IoT leak sensor webhook auto-opens prioritized ticket

---

## 🔁 Evolution Path
Checklist app → asset graph → agent explanations → optional marketplace for vetted pros (separate trust layer)

---

## 🤖 Agent breakdown
- **Due-date engine (tool):** deterministic from manufacturer intervals + your last service date.  
- **Risk narrator agent:** reads telemetry + age + region climate to prioritize top 3 actions this month.  
- **Procedure writer pass:** fetches or drafts DIY steps only from approved template library + one LLM paraphrase layer.

---

## 🎓 What You Learn
Longitudinal home graphs, trustworthy maintenance UX, reminder systems that do not spam
