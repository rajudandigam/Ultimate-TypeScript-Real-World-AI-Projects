System Type: Agent  
Complexity: Level 4  
Industry: R&D / Chemistry  
Capabilities: Reasoning, Planning  

# Chemical Synthesis Planning Agent

## 🧠 Overview
Assists chemists by proposing **reaction pathways**, **reagent checks**, and **step ordering** from **structured reaction databases** and **in-lab inventory tools**—**flags hazardous or incompatible** sequences using **rule engines + literature RAG**; **never** replaces lab safety review or SDS obligations.

---

## 🎯 Problem
Route scouting is slow; inventory mismatches waste time; junior chemists may miss incompatible solvents or thermal runaway risks.

---

## 💡 Why This Matters
- **Pain it removes:** Literature fragmentation and under-documented incompatibilities.
- **Who benefits:** Medicinal chemistry, CROs, and university labs with ELN workflows.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **reaction SMARTS / template tools**, **inventory queries**, and **safety rulesets** evaluated **before** presenting any step.

---

## ⚙️ Complexity Level
**Target:** Level 4 — domain reasoning, safety interlocks, and regulated lab context.

---

## 🏭 Industry
Scientific R&D

---

## 🧩 Capabilities
Reasoning, Planning, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK tools, RDKit or external cheminformatics microservice, Postgres ELN hooks, Reaxys/Patent APIs (licensed), vector RAG on internal lab notebooks (access-controlled), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Chemical Synthesis Planning Agent** (Agent, L4): prioritize components that match **agent** orchestration and the **research-ai** integration surface.

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
Goal molecule + constraints → **Synthesis Agent** searches templates → checks inventory + hazard classes → outputs DAG of steps → ELN export JSON → human PI approval gate

---

## 🔄 Implementation Steps
1. Template retrosynthesis from known scaffolds only  
2. Add stoichiometry and solvent volume estimates  
3. Integrate waste stream tagging  
4. Nightly sync of inventory from barcode DB  
5. Bench-scale vs scale-up flag sets different rule packs  

---

## 📊 Evaluation
Chemist edit distance on accepted plans, safety rule trigger precision, inventory mismatch rate, time saved vs manual route search

---

## ⚠️ Challenges & Failure Cases
**Novel unstable intermediates** not in DB; hallucinated reagents; IP-sensitive routes leaked—hard refusal without sources, air-gapped mode, red-team on adversarial prompts, export watermarking

---

## 🏭 Production Considerations
Export control lists, lab notebook confidentiality, SDS linkage mandatory, audit who generated what plan revision

---

## 🚀 Possible Extensions
Automated ordering draft for approved pathways (ERP cart with human submit)

---

## 🤖 Agent breakdown
- **Retrosynthesis search tool:** graph search over licensed reaction corpora.  
- **Safety checker tool:** deterministic incompatibility matrix + thermal estimates.  
- **Planner agent:** sequences steps, balances equivalents, cites literature spans.

---

## 🎓 What You Learn
Cheminformatics integration, safety-first scientific AI, ELN-grounded workflows
