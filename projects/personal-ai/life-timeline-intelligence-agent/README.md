System Type: Agent  
Complexity: Level 3  
Industry: Personal intelligence / privacy-first consumer  
Capabilities: Memory, Personalization  

# Life Timeline Intelligence Agent

## 🧠 Overview
Builds a **user-owned structured timeline** from **opt-in sources** (photos EXIF, calendars, messaging exports, travel confirmations) to surface **patterns** (travel streaks, recurring people, health habits proxies) and **gentle reminders**—**not** a general do-everything assistant: the **timeline graph** is the product surface, with **local-first** options and **granular deletion**.

*Catalog note:* Distinct from **`Personal AI Life Assistant`** (broad L5 planning + memory copilot). This project is **timeline-centric recall + insight** with strict **consent scopes** per connector.

---

## 🎯 Problem
Memories are trapped in silos; users cannot answer “when was I last in Tokyo with Alex?” without manual archaeology; generic assistants lack durable structured memory UX.

---

## 💡 Why This Matters
- **Pain it removes:** Lost context for journaling, taxes, insurance, and family storytelling.
- **Who benefits:** Privacy-conscious individuals and “digital packrat” power users.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **timeline query tools** and **insight templates**; ingestion is **ETL jobs** the user triggers or schedules on-device.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multi-modal metadata fusion with strong privacy engineering.

---

## 🏭 Industry
Consumer productivity / personal data

---

## 🧩 Capabilities
Memory, Personalization, Planning, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Tauri or Expo (local vault), Node.js optional sync server with E2EE, SQLite/DuckDB on device, Google/Apple Calendar APIs (scoped), OpenAI SDK on-device or private relay with redaction, OpenTelemetry (opt-in diagnostics)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Life Timeline Intelligence Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **personal-ai** integration surface.

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
Connectors → **normalization** → **event graph** (who/where/when) → **Timeline Agent** answers path queries → optional narrative “year in review” exports (offline PDF)

---

## 🔄 Implementation Steps
1. Photo EXIF + album clustering only  
2. Calendar merge with dedupe keys  
3. Chat export parsers (WhatsApp/iMessage backup patterns) with PII minimization  
4. People co-occurrence graph with merge UI  
5. Reminder rules (“visa renewal window”) tied to events  

---

## 📊 Evaluation
User-reported “found the memory” success, connector completion rate, deletion honor audits, support volume on mis-linked people

---

## ⚠️ Failure Scenarios
**Wrong person merge**; **leaked message content** to cloud LLM; **stalking misuse**—pairing confirmations, abuse reporting, block remote access modes, on-device-only inference tier

---

## 🤖 Agent breakdown
- **Ingest tools:** parse exports into canonical `LifeEvent` schema.  
- **Graph query tool:** time range + entity filters with caps.  
- **Insight agent:** proposes patterns from aggregates (counts, gaps), cites event IDs, never fabricates dates.

---

## 🎓 What You Learn
Personal knowledge graphs, E2EE product patterns, responsible memory UX
