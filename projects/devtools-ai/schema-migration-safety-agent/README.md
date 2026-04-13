System Type: Agent  
Complexity: Level 3  
Industry: DevTools / SRE  
Capabilities: Risk analysis  

# Schema Migration Safety Agent

## 🧠 Overview
Analyzes **SQL/ORM migrations** (Flyway, Prisma, Liquibase, Rails) across **branches** to **predict breaking changes**: dropped columns still read by services, **unsafe defaults**, **long-running locks**, **backfill** hazards—pairs with **CI** to **block merges** or require **expand–contract playbooks** with **generated rollback notes**.

---

## 🎯 Problem
“Small” migrations take down production: missing index on FK add, NOT NULL without default, or service still expecting removed JSON keys.

---

## 💡 Why This Matters
- **Pain it removes:** Sev-1 deploys and multi-hour rollbacks.
- **Who benefits:** Platform teams and service owners in microservice monorepos.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **static analysis + SQL AST tools**; final verdict merges **deterministic rules** with **LLM explanations** for developer UX.

---

## ⚙️ Complexity Level
**Target:** Level 3 — repo-wide dependency graph + migration diff semantics.

---

## 🏭 Industry
Developer infrastructure

---

## 🧩 Capabilities
Risk analysis, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, libpg-query / sql-parser, Prisma migrate diff, GitHub/GitLab APIs, Postgres EXPLAIN harness on ephemeral DBs, OpenAI SDK, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Schema Migration Safety Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **devtools-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- GitHub / GitLab / Azure DevOps REST APIs
- CI provider APIs (GitHub Actions, CircleCI)
- Package registry APIs where relevant

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
PR opened → fetch migration files + **service ORM usage index** (prior batch job) → **Safety Agent** emits **risk report JSON** → status check fails on SEV1 → optional autofix suggestions (separate PR)

---

## 🔄 Implementation Steps
1. SQL AST diff + banned patterns list  
2. Cross-reference TypeScript field usage via ts-morph  
3. Lock time estimator from EXPLAIN on shadow DB  
4. Expand–contract template library per risk class  
5. Org-wide migration scorecard dashboard  

---

## 📊 Evaluation
Prevented incident count (retro tagged), false positive rate on PRs, median time to safe migration, developer override reasons

---

## ⚠️ Failure Scenarios
**Dynamic SQL** invisible to static scan; **multi-region lag** on backfills; ORM **raw queries** bypass—escape hatch with annotated suppressions, code owners, shadow DB size limits

---

## 🤖 Agent breakdown
- **AST diff tool:** structural migration changes.  
- **Usage graph tool:** maps columns to TS types/services.  
- **Risk scorer:** deterministic matrix (severity × likelihood).  
- **Explainer agent:** turns JSON into human steps and links to playbook docs.

---

## 🎓 What You Learn
Database reliability engineering, CI gates for schema, communicating risk without noise
