System Type: Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Analysis  

# Performance Review Intelligence Agent

## 🧠 Overview
Helps managers draft **fair, evidence-based** review narratives by pulling **goals, project artifacts, peer feedback summaries** (where policy allows) via tools—outputs highlight **strengths, gaps, growth paths** as **draft text** with **source citations**; **not** auto-submitting ratings or **bypassing** calibration sessions. **Bias and privacy** controls are mandatory.

---

## 🎯 Problem
Review cycles compress into low-quality text; managers forget accomplishments; calibration lacks shared evidence language.

---

## 💡 Why This Matters
- **Pain it removes:** Blank-page manager stress, inconsistent feedback quality, and weak development plans.
- **Who benefits:** People managers and HRBPs in mid-to-large orgs.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using). `fetch_goals`, `fetch_ship_log`, `fetch_feedback_agg`, `draft_sections`.

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-source synthesis + structured review schema; L4+ adds calibration copilot with org-wide analytics (heavily governed).

---

## 🏭 Industry
HR / performance management

---

## 🧩 Capabilities
Retrieval, Reasoning, Planning, Observability, Personalization (role-aware)

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK, Workday/Lattice/Culture Amp APIs (read), internal git/PM summaries (scoped), Postgres, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Performance Review Intelligence Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **hr** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Workday / BambooHR / Greenhouse-style APIs (pick what your org uses)
- Slack / Teams
- Google Drive / SharePoint for doc sources

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
Manager console → agent with read-only HR tools → structured draft → manager edits → HRIS export (manual or gated automation)

---

## 🔄 Implementation Steps
Template-only drafts → add goal fetch → add aggregated 360 text with redaction → citation-required narrative → calibration helper mode (read-only suggestions)

---

## 📊 Evaluation
Manager time saved, perceived fairness surveys, HRBP edit distance, incident rate of inappropriate content (target 0)

---

## ⚠️ Challenges & Failure Cases
Hallucinated achievements; leaking peer identity; demographic bias in language; storing sensitive text insecurely; overriding calibration outcomes—mitigate with citations, aggregation rules, style/fairness lint, encryption, explicit non-authority for ratings

---

## 🏭 Production Considerations
Least-privilege reads, retention windows, legal hold, union context rules, accessibility of generated HTML, audit of who generated what for which employee

---

## 🚀 Possible Extensions
Growth plan suggestions tied to internal learning catalog IDs only

---

## 🔁 Evolution Path
Templates → tool-backed drafting → calibration analytics assist → multi-agent with strict separation of duties

---

## 🎓 What You Learn
Performance cycle tooling, evidence-based people analytics UX, HRIS integration safety
