System Type: Agent  
Complexity: Level 3  
Industry: Real Estate  
Capabilities: Financial Analysis  

# Real Estate Investment Analyzer

## 🧠 Overview
Builds **investment memos** for **acquisitions** by combining **rent roll**, **T-12**, **loan terms**, **tax/insurance**, and **market comps** via tools—outputs **cash-on-cash, DSCR sensitivities, exit scenarios** with **tables from compute engine**, not invented math; **not** investment advice—disclaimers and **data lineage** required.

---

## 🎯 Problem
Underwriting packs are repetitive; Excel models drift from source documents; teams need faster first-pass consistency.

---

## 💡 Why This Matters
Accelerates IC memos while preserving auditability for lenders and partners.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over a **deterministic financial core**.

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-tab ingestion + scenario narration; L5 would add full IC-grade governance and Monte Carlo fleets.

---

## 🏭 Industry
Real estate / acquisitions & REPE

---

## 🧩 Capabilities
Prediction, Reasoning, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, TS financial libs or Python sidecar for numpy, OpenAI SDK, document parsers, Postgres, Excel export, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Real Estate Investment Analyzer** (Agent, L3): prioritize components that match **agent** orchestration and the **real-estate** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- MLS / listing feeds (license-dependent)
- Maps APIs
- CRM (HubSpot, Salesforce) if broker workflow

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
Deal room upload → extract tables to canonical schema → compute engine runs scenarios → agent narrates with citations to rows → PDF memo

---

## 🔄 Implementation Steps
Manual template → structured extraction → locked formulas in code → agent explains deltas → lender package checklist automation

---

## 📊 Evaluation
Numeric parity vs analyst gold models, time per deal, error rate on key ratios, reviewer edit distance

---

## ⚠️ Challenges & Failure Cases
OCR misreads rent; wrong unit count; LLM rounding errors vs engine; confidential data leaks—engine owns numbers, redact PII, version inputs, human sign-off for IC

---

## 🏭 Production Considerations
Deal room ACL, watermarking, retention, SOX-style access if public company adjacency, model version pinning

---

## 🚀 Possible Extensions
Portfolio rollup, debt quote scenario from lender API (licensed)

---

## 🔁 Evolution Path
Spreadsheet → structured deal DB → compute+narrate agent → portfolio intelligence

---

## 🎓 What You Learn
Real estate finance modeling boundaries, doc-to-schema ETL, IC memo automation ethics
