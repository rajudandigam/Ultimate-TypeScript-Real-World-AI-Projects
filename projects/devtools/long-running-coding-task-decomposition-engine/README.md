System Type: Agent  
Complexity: Level 4  
Industry: DevTools  
Capabilities: Planning  

# Long-Running Coding Agent (Task Decomposition Engine)

## 🧠 Overview
A **persistent coding agent** that **decomposes** large tasks into **checklisted substeps**, executes them in a **sandboxed repo** with **tool loops** (`read_file`, `apply_patch`, `run_tests`, `open_pr`), and **checkpoints** state so work can resume across sessions—**human merge** remains the gate; the agent does not bypass branch protection.

---

## 🎯 Problem
One-shot codegen fails on multi-file refactors; teams need **incremental** execution with **verifiable** milestones and **auditable** history.

---

## 💡 Why This Matters
- **Pain it removes:** Half-done AI refactors, untested bulk edits, and opaque “it tried something” outcomes.
- **Who benefits:** Staff engineers and platform teams automating migrations and large internal chores.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using) with **external orchestration** (workflow for checkpoints/leases)

The “engine” is **orchestration + state machine** around one primary agent to keep accountability clear; L4 reflects planning depth and infra surface area.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Long-horizon planning, sandbox CI, PR lifecycle, and org policy—bordering L5 when you add fleet-wide autonomy and formal verification.

---

## 🏭 Industry
Example:
- DevTools / autonomous software engineering (governed)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — codebase index, ADRs, prior PRs
- Planning — **in scope** (task DAG, rollback points)
- Reasoning — bounded (tradeoffs, test strategy)
- Automation — PR creation, CI triggers
- Decision making — bounded (next step selection)
- Observability — **in scope**
- Personalization — org coding standards
- Multimodal — optional design mock inputs

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** worker + **OpenAI SDK** / **Anthropic** tools
- **Temporal** for durable sessions, heartbeats, and resume tokens
- **Docker** / **Firecracker** sandboxes for test execution
- **Postgres** for plan graph + checkpoints
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Long-Running Coding Agent (Task Decomposition Engine)** (Agent, L4): prioritize components that match **agent** orchestration and the **devtools** integration surface.

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
Describe the main components:

- **Input (UI / API / CLI):** Task spec (markdown), repo + branch, budget caps.
- **LLM layer:** Primary agent with strict tool schemas and step budgets.
- **Tools / APIs:** Git, CI, issue tracker, code index, test runner.
- **Memory (if any):** Checkpointed plan state; vector index over repo chunks.
- **Output:** Branch commits, PRs, human-readable plan log.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single-session patch for one file with manual approval.

### Step 2: Add AI layer
- LLM proposes step list; human approves before execution.

### Step 3: Add tools
- Sandboxed run_tests; block network egress except package registry allowlist.

### Step 4: Add memory or context
- Persist checkpoints after each green test milestone.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional reviewer agent that only comments (no write tools).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** % tasks completed to spec on benchmark repos without human takeover.
- **Latency:** Wall clock per task vs human baseline (pilot).
- **Cost:** Tokens + CI minutes per task.
- **User satisfaction:** Edit distance on merged PRs; trust scores.
- **Failure rate:** Infinite loops, destructive edits, secret exfiltration attempts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claims tests passed without tool evidence; require tool receipts in context.
- **Tool failures:** Flaky CI; backoff and quarantine steps, not blind retries that mutate more.
- **Latency issues:** Large repos; narrow workspace mounts and incremental indexing.
- **Cost spikes:** Unbounded replanning; cap replans and require human fork.
- **Incorrect decisions:** Subtle security vulnerabilities introduced at scale; mandatory diff review for sensitive paths.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit of tool calls and outputs (redacted).
- **Observability:** Step success rates, sandbox escape attempts, token burn rate.
- **Rate limiting:** Per user/org concurrency; global sandbox pool limits.
- **Retry strategies:** Idempotent git operations; lease renewal for long jobs.
- **Guardrails and validation:** Path allowlists, secret scanning on patches, CODEOWNERS for hot paths.
- **Security considerations:** Sandboxing, credential injection via OIDC short-lived tokens, no raw long-lived PATs in agent context.

---

## 🚀 Possible Extensions

- **Add UI:** Plan DAG visualization with manual reorder.
- **Convert to SaaS:** Multi-tenant long-running agent product.
- **Add multi-agent collaboration:** Implementer + reviewer + tester roles with strict tool separation.
- **Add real-time capabilities:** Streaming thought summaries to Slack (policy-governed).
- **Integrate with external systems:** GitHub Projects, Jira, Linear.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **checkpointed** reliability before expanding tool power.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Durable execution** for coding agents
  - **Sandbox** design for untrusted codegen
  - **Human-in-the-loop** merge discipline
  - **System design thinking** for long-horizon autonomy
