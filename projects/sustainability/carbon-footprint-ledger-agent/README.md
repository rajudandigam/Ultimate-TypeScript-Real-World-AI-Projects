System Type: Agent  
Complexity: Level 3  
Industry: Sustainability / ESG  
Capabilities: Analysis, Compliance  

# Carbon Footprint Ledger Agent

## 🧠 Overview
Builds a **double-entry style emissions ledger** from **invoices, utility bills, travel bookings, and procurement categories**, classifies **Scope 1/2/3** per **GHG Protocol**-aligned rules, and helps draft **ESG disclosure tables**—distinct from general climate analytics: this system is **ledger-first**, **audit-first**, and ties every kgCO₂e to **source document IDs**.

*Catalog note:* Complements **`Climate & Sustainability Intelligence Agent`** (holistic analytics); this project is **transactional accounting + disclosure packaging**.

---

## 🎯 Problem
Spreadsheet carbon accounting breaks under audit; scope boundaries drift; finance and sustainability teams disagree on mappings.

---

## 💡 Why This Matters
- **Pain it removes:** Restatement risk and painful assurance cycles.
- **Who benefits:** Sustainability controllers, FP&A, and pre-IPO companies.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **SQL/ledger tools**; classification rules are **versioned code + tables**, not LLM memory.

---

## ⚙️ Complexity Level
**Target:** Level 3 — integrations, factor tables, and disclosure templates.

---

## 🏭 Industry
ESG / corporate reporting

---

## 🧩 Capabilities
Analysis, Compliance, Automation, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Postgres ledger schema, dbt, Snowflake/BigQuery loaders, Activity/Spend-based factor packs (EPA IPCC), OpenAI SDK for narrative on **joined rows only**, Docling/PDF parsers, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Carbon Footprint Ledger Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **sustainability** integration surface.

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
Document ingest → line-item extraction → **mapping agent** proposes GL→emission category → human confirm queue → post to ledger → CSRD/TCFD export packs

---

## 🔄 Implementation Steps
1. Scope 2 location-based vs market-based toggle  
2. Travel GDS + p-card imports  
3. Supplier-specific factors where contracted  
4. Period close with immutability seals  
5. Third-party assurance read-only workspace  

---

## 📊 Evaluation
Reconciliation variance vs assurance sample, mapping time per invoice, restatement count, auditor query resolution time

---

## ⚠️ Challenges & Failure Cases
**Double counting** across subsidiaries; wrong factor vintage; LLM invents emissions—deterministic calc engine is source of truth; agent only explains **existing** ledger lines

---

## 🏭 Production Considerations
Data residency, segregation of duties, immutable audit log, retention schedules, SOX-adjacent controls for public filers

---

## 🚀 Possible Extensions
Supplier engagement questionnaires feeding Scope 3 category 1 with evidence attachments

---

## 🤖 Agent breakdown
- **Extractor pass:** OCR/parse to structured rows (human verify for low confidence).  
- **Mapper agent:** proposes category + factor version with rationale citing rule table IDs.  
- **Narrator agent:** generates disclosure prose paragraphs locked to totals from SQL.

---

## 🎓 What You Learn
GHG accounting mechanics, ledger-grade AI guardrails, assurance-ready reporting
