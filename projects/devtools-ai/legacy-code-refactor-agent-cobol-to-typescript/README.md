System Type: Agent  
Complexity: Level 5  
Industry: DevTools / Modernization  
Capabilities: Reasoning, Transformation  

# Legacy Code Refactor Agent (COBOL → TypeScript)

## 🧠 Overview
A **governed modernization agent** that ingests **COBOL (and copybooks)**, builds a **semantic graph** (paragraphs, data divisions, file sections, calls), and emits **TypeScript service modules** with **parity tests** from **golden batch jobs**—**human architect approval** gates every merge; targets **strangler-fig** migration (HTTP/BFF in front of mainframe) not fantasy “one-click rewrite.”

*Catalog note:* Distinct from **`Codebase Migration Automation System`** (general workflow migration); this is **mainframe COBOL → TS** with **L5** rigor: proofs, diffs, and regulatory data sensitivity.

---

## 🎯 Problem
COBOL cores are expensive to maintain; vendor lock-in; juniors cannot safely change batch logic; blind LLM translation creates silent financial bugs.

---

## 💡 Why This Matters
- **Pain it removes:** Multi-year rewrite paralysis and undocumented copybook sprawl.
- **Who benefits:** insurers, banks, and public sector clearing modernization roadmaps.

---

## 🏗️ System Type
**Chosen:** **Single Agent** orchestrating **parser tools**, **symbol graph DB**, and **codegen templates**; **test harness** is non-LLM.

---

## ⚙️ Complexity Level
**Target:** Level 5 — correctness evidence, security, and long-horizon program management.

---

## 🏭 Industry
Enterprise engineering / modernization

---

## 🧩 Capabilities
Reasoning, Transformation, Automation, Observability, Retrieval

---

## 🛠️ Suggested TypeScript Stack
Node.js, GnuCOBOL or vendor parsers (Micro Focus), Tree-sitter custom grammar where applicable, Postgres graph, OpenAI SDK for guided refactor, Jest parity suites, OpenTelemetry, Bazel/monorepo for generated packages

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Legacy Code Refactor Agent (COBOL to TypeScript)** (Agent, L5): prioritize components that match **agent** orchestration and the **devtools-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
Repo ingest → **parse + normalize** → **graph builder** → **slice planner** (strangler boundaries) → **Agent codegen** per slice → **compile & unit tests** → **batch diff** on sample JCL datasets → PR with human reviewer checklist

---

## 🔄 Implementation Steps
1. Read-only inventory + dead code detection  
2. Data division → TypeScript types codegen  
3. File I/O → S3/queue adapters with interface seams  
4. CICS transaction boundaries mapped to HTTP routes (design)  
5. Continuous reconciliation reports vs production logs (shadow)  

---

## 📊 Evaluation
Parity % on golden batches, defect escape rate post-merge, cyclomatic complexity reduction, time-to-first shippable slice

---

## ⚠️ Failure Scenarios
**FLOAT vs packed decimal** mismatches; **implicit fall-through** in PERFORM chains; **missing copybook** versions—typed money wrappers, exhaustive diff logs, refuse codegen until graph resolves, never auto-deploy to prod

---

## 🤖 Agent breakdown
- **Parser toolchain:** deterministic AST + diagnostics.  
- **Graph agent:** proposes module boundaries with coupling metrics from static analysis.  
- **Codegen agent:** emits TS using locked templates + property tests; cites source line spans.  
- **Reviewer copilot:** summarizes risk hotspots for human architects (no auto-merge).

---

## 🎓 What You Learn
Mainframe semantics, safe LLM-assisted codegen, strangler-fig architecture patterns
