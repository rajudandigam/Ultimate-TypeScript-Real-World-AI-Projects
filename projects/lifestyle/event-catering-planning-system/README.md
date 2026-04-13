System Type: Agent  
Complexity: Level 3  
Industry: Lifestyle / Events  
Capabilities: Planning  

# Event Catering Planning System

## 🧠 Overview
Helps hosts plan **catering-scale food** for birthdays, weddings, or company offsites: **headcount-based quantities**, **menu themes**, **dietary coverage**, and **shortlisted vendors** with **rough budget bands**—grounded in **user headcount**, **service style** (buffet vs plated), and **vendor directory tools** (not invented prices).

---

## 🎯 Problem
Quantity spreadsheets are error-prone; dietary coverage is uneven; comparing caterers is apples-to-oranges without a structured brief.

---

## 💡 Why This Matters
- **Pain it removes:** Waste, shortages, and last-minute catering scrambles.
- **Who benefits:** Small business admins, wedding planners, and busy parents.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **multi-step tool plan** (calculator, vendor search, checklist generator); durable reminders via **workflow**.

---

## ⚙️ Complexity Level
**Target:** Level 3 — structured planning + external data + guardrails.

---

## 🏭 Industry
Lifestyle / small events

---

## 🧩 Capabilities
Planning, Optimization, Retrieval, Personalization, Automation

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres events, OpenAI SDK tools, spreadsheet export (CSV), Google Places / Yelp for caterers (licensed), Temporal for reminders, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Event Catering Planning System** (Agent, L3): prioritize components that match **agent** orchestration and the **lifestyle** integration surface.

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
Intake form → **Catering Agent** computes portions + menu skeleton → vendor query → RFP-style brief PDF → host edits → optional “request quote” email templates

---

## 🔄 Implementation Steps
1. Static portion multipliers per item type  
2. Add dietary tags and minimum vegetarian %  
3. Vendor shortlist with distance + rating filters  
4. Budget sensitivity sliders (low/med/high)  
5. Day-of timeline (drop-off vs full service)  

---

## 📊 Evaluation
Host-reported “ran out of food” incidents (target ~0), leftover mass proxy, quote response rate when using generated briefs

---

## ⚠️ Challenges & Failure Cases
**Underestimating teens vs adults**; stale vendor availability; hallucinated menu items—segment multipliers from tool tables, show assumptions explicitly, require vendor IDs from search tool

---

## 🏭 Production Considerations
Food safety disclaimers, allergen “cannot guarantee” language, regional liquor laws if suggesting bar packages

---

## 🚀 Possible Extensions
RSVP-linked auto-adjust quantities T-48h before event

---

## 🔁 Evolution Path
PDF templates → agent-filled briefs → vendor API integrations where partners exist

---

## 🤖 Agent breakdown
- **Step planner:** chooses sequence (headcount → dietary mix → menu → quantities → vendors).  
- **Quantity engine (tool):** deterministic math from catering rules table (editable).  
- **Copywriter sub-pass:** turns structured plan into host-facing narrative + shopping list.

---

## 🎓 What You Learn
Structured event planning, hybrid deterministic + LLM UX, responsible vendor discovery
