System Type: Agent  
Complexity: Level 4  
Industry: Productivity  
Capabilities: Analysis  

# AI Spreadsheet Copilot

## 🧠 Overview
A **grid-aware assistant** that explains **formulas**, suggests **fixes** for common errors (#REF!, circular refs), and generates **insights** from **tabular summaries** produced by the host (not by hallucinating cell values)—integrated as a **plugin** to web spreadsheets or your own canvas component with **sandboxed** formula evaluation.

---

## 🎯 Problem
Spreadsheet power users hit opaque errors; analysts waste time explaining pivot logic. Chat-only bots lack **A1 references** and **sheet topology**. You need **structured range metadata** and **safe execution** of suggested formulas.

---

## 💡 Why This Matters
- **Pain it removes:** Debugging time, onboarding friction for complex models, and shallow “AI formulas” that break on edge rows.
- **Who benefits:** Finance ops, FP&A teams, and builders of collaborative spreadsheet products.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One agent with tools like `get_range_preview`, `parse_formula`, `lint_sheet`, `suggest_pivot_config` keeps UX predictable.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Combines **context from large grids**, **formula semantics**, and **evaluation sandbox**—production hardening to L5 adds enterprise ACLs, versioning, and full audit for financial models.

---

## 🏭 Industry
Example:
- Productivity (spreadsheets, FP&A, collaborative quant models)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (internal FP&A methodology docs)
- Planning — bounded (multi-step refactor plan)
- Reasoning — **in scope** (explain dependency chains)
- Automation — optional (apply patch across range with preview)
- Decision making — bounded (flag risky assumptions)
- Observability — **in scope**
- Personalization — optional (org templates)
- Multimodal — optional (chart image → ask questions only if linked to underlying series JSON)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **TypeScript** canvas/grid component or **HyperFormula** / **Handsontable** integrations
- **Web Worker** for formula eval sandbox
- **Node.js** BFF for agent + tools
- **OpenAI SDK** (structured outputs)
- **Postgres** optional for workbook versioning
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Spreadsheet Copilot** (Agent, L4): prioritize components that match **agent** orchestration and the **productivity** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Gmail / Microsoft Graph mail & calendar
- Slack / Teams webhooks & bot APIs
- Notion / Jira / Linear REST

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **CopilotKit** — in-app copilot state, shared context with React, safer UI action wiring.
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
Describe the main components:

- **Input (UI / API / CLI):** Selected ranges, sheet graph metadata, user question.
- **LLM layer:** Agent proposes **operations** (insert formula, split column) as JSON ops.
- **Tools / APIs:** Parse AST, evaluate sample cells, detect cycles, summarize statistics.
- **Memory (if any):** Named ranges dictionary; prior refactor sessions per workbook id.
- **Output:** Diff preview UI; user accepts/rejects ops; undo stack preserved client-side.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Formula explainer from AST only; no free chat.

### Step 2: Add AI layer
- LLM turns AST JSON into plain language.

### Step 3: Add tools
- Add stats tools over server-side aggregates for large sheets.

### Step 4: Add memory or context
- Store workbook “assumption table” as structured key-values the agent must respect.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **auditor** agent that only flags risk (read-only tools).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Formula suggestion correctness on benchmark workbooks; human reject rate.
- **Latency:** p95 under large range selections with capped preview rows.
- **Cost:** Tokens per session for typical FP&A questions.
- **User satisfaction:** Time saved on debug tasks; qualitative trust.
- **Failure rate:** Wrong cell references, broken pivots, silent numeric changes without preview.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented cell values; mitigated by never presenting numbers not returned from eval/summary tools.
- **Tool failures:** Worker crash on heavy eval; mitigated by row caps, sampling, and graceful errors.
- **Latency issues:** Serial tool calls over huge sheets; mitigated by server-side aggregates and pagination.
- **Cost spikes:** Dumping entire sheet to model; mitigated by topology + sample strategy.
- **Incorrect decisions:** Destructive bulk fill; mitigated by op budgets, dry-run preview, mandatory confirm for wide writes.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log op types and hashes, not full sheet content by default.
- **Observability:** Eval error taxonomy, undo rate, op rejection reasons, worker CPU.
- **Rate limiting:** Per workbook and per user; detect exfiltration via repeated full-sheet pulls.
- **Retry strategies:** Idempotent op application with version vectors for concurrency.
- **Guardrails and validation:** Block external network calls from user-defined macros in same trust zone as eval sandbox.
- **Security considerations:** XSS via imported CSV, formula injection to exfil data—sanitize and isolate eval; tenant isolation for cloud workbooks.

---

## 🚀 Possible Extensions

- **Add UI:** Dependency graph visualization with click-to-explain.
- **Convert to SaaS:** Hosted spreadsheet copilot with team templates.
- **Add multi-agent collaboration:** Separate SQL agent for warehouse-connected sheets.
- **Add real-time capabilities:** Collaborative cursors + live copilot hints (OT/CRDT careful merge).
- **Integrate with external systems:** ERP exports, BI tools, Git for workbook versioning.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **explain-only**; add **apply ops** after sandbox and preview mature.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Formula AST** tooling in TS
  - **Sandboxed eval** and safety boundaries
  - **Diff-first** AI editing UX
  - **System design thinking** for data-heavy UIs
