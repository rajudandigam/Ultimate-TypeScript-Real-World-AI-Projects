System Type: Multi-Agent  
Complexity: Level 4  
Industry: Legal / Corporate Development  
Capabilities: Research  

# Due Diligence Multi-Agent System

## 🧠 Overview
A **multi-agent diligence workspace** for M&A and major vendor deals: **Financial**, **Legal**, and **Technical** specialist agents ingest **VDR documents** and **data-room Q&A logs**, extract **risk themes**, cross-link **inconsistencies**, and produce a **master findings memo** with **citations to source files**—**partner review** is mandatory before any **go/no-go** language is issued.

---

## 🎯 Problem
Diligence is parallel but siloed; issues surface late; LLM summaries without citations are unusable in committee materials.

---

## 💡 Why This Matters
- **Pain it removes:** Duplicate reading, missed red flags across domains, and slow alignment between workstreams.
- **Who benefits:** Corp dev, legal counsel, finance FP&A, and technical architects in transactions.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** with a **supervisor** that merges structured outputs and enforces **privilege / confidentiality** tags.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-domain reasoning, heavy document IO, and governance.

---

## 🏭 Industry
Legal / M&A operations

---

## 🧩 Capabilities
Research, Retrieval, Reasoning, Planning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI Agents SDK, object storage (S3/GCS) with presigned URLs, OCR pipeline, Postgres graph of entities (contracts, subsidiaries), OpenTelemetry, DocuSign/VDR APIs as allowed

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Due Diligence Multi-Agent System** (Multi-Agent, L4): prioritize components that match **multi** orchestration and the **legal** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- E-signature provider APIs (DocuSign, Dropbox Sign)
- DMS / CMS search APIs
- Court / filing portals only where licensed

### Open Source Building Blocks
- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.
- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node service + OpenAI Agents SDK + Postgres state store + Redis queue for async specialist work + OTel traces — fits handoff-heavy blueprints.
- **Lightweight:** Single Node process + in-memory queue for demos; still use Zod schemas and one Postgres schema for trip/issue graph state.
- **Production-heavy:** LangGraph for explicit graph control + dedicated worker pool per agent family + strict RBAC on tools + eval harness in CI.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
VDR sync → chunk + index with ACLs → **Financial Agent** (metrics, QoE flags) + **Legal Agent** (change-of-control, IP) + **Tech Agent** (security, architecture debt) → **Synthesizer** → redlined memo → human approval queue

---

## 🔄 Implementation Steps
1. Single-domain Q&A on indexed subset  
2. Cross-reference cap table vs employment agreements  
3. Security questionnaire ingestion + evidence mapping  
4. Issue severity rubric with partner sign-off  
5. Export to deal committee slide outline  

---

## 📊 Evaluation
Citation accuracy on spot checks, time saved vs manual memo, duplicate issue rate across agents, privilege tag violation count (must be **zero**)

---

## ⚠️ Challenges & Failure Cases
**Cross-tenant leakage** if ACL bugs; hallucinated clause references; **overconfident risk ratings**—hard ACL tests, span-level citations, conservative language templates, human-in-loop for severity

---

## 🏭 Production Considerations
Attorney-client privilege workflows, watermarking downloads, export controls, retention and destruction schedules, regional hosting

---

## 🚀 Possible Extensions
Post-close integration tracker that maps findings to remediation OKRs

---

## 🔁 Evolution Path
Manual dataroom checklist → RAG Q&A → supervised multi-agent diligence → auditable transaction intelligence platform

---

## 🎓 What You Learn
High-stakes multi-agent coordination, document-grounded reporting, legal-adjacent security design
