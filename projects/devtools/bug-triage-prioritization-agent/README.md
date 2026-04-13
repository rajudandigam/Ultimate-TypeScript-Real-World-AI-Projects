System Type: Agent  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Classification, Reasoning  

# Bug Triage & Prioritization Agent

## 🧠 Overview
An **issue-triage agent** that clusters duplicates, suggests **severity**, **component routing**, and **likely root-cause hypotheses** using **structured signals** (stack traces, git bisect hints, recent deploys)—outputs are **recommendations** to humans; **SLA fields** in your tracker are updated only through **validated automation rules**.

---

## 🎯 Problem
Backlogs drown on-call engineers; duplicates and missing repro steps waste cycles. You need **fast, consistent** first-pass triage without pretending the model **owns** production incidents.

---

## 💡 Why This Matters
- **Pain it removes:** Context switching, misrouted bugs, and stale priorities after incidents.
- **Who benefits:** Engineering orgs using GitHub Issues, Jira, Linear, etc.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `search_issues`, `fetch_trace`, `list_recent_deploys`, `suggest_labels` (schema constrained).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. RAG over past incidents + cross-system retrieval; L4+ adds specialist agents (frontend vs backend) with debate protocols.

---

## 🏭 Industry
Example:
- DevTools / engineering operations

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — historical issues, runbooks, codeowners map
- Planning — bounded (triage checklist)
- Reasoning — bounded (hypothesis ranking)
- Automation — optional auto-label when confidence high
- Decision making — bounded (priority suggestion)
- Observability — **in scope**
- Personalization — team-specific rubrics
- Multimodal — optional screenshot OCR for UI bugs

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** GitHub App or Jira webhook service
- **OpenAI SDK** with structured outputs
- **Postgres** for embeddings of issues + incidents
- **OpenTelemetry**, **LaunchDarkly** flags

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Bug Triage & Prioritization Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **devtools** integration surface.

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

- **Input (UI / API / CLI):** Issue opened/edited webhooks, `/triage` commands.
- **LLM layer:** Agent composes `TriageProposal` JSON.
- **Tools / APIs:** Issue tracker, CI test history, deploy changelog, PagerDuty/Opsgenie optional reads.
- **Memory (if any):** Vector index of resolved issues with outcome labels.
- **Output:** Labels, comments with evidence links, optional routing tasks.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rule-based labels from file path patterns.

### Step 2: Add AI layer
- LLM writes human-readable summary from issue body only.

### Step 3: Add tools
- Pull stack traces from linked Sentry issues; search duplicates.

### Step 4: Add memory or context
- Retrieve top-k similar resolved issues with their final root cause tags.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Multi-agent “advocate/skeptic” review for sev-1 suggestions only.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision on auto-labels vs human gold set; duplicate detection recall.
- **Latency:** p95 webhook→comment time.
- **Cost:** Tokens per issue; index refresh costs.
- **User satisfaction:** Engineer thumbs-up/down on suggestions.
- **Failure rate:** Wrong ownership, escalated sev inflated, leaking customer data in comments.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented stack frames; mitigated by quoting tool-sourced text only.
- **Tool failures:** Missing integrations; degrade to summary-only mode with banner.
- **Latency issues:** Large threads; summarize with chunked retrieval.
- **Cost spikes:** Image-heavy issues; cap attachments processed.
- **Incorrect decisions:** Auto-closing as duplicate incorrectly; require human ack for destructive actions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log proposal ids; scrub PII from bodies before model calls where required.
- **Observability:** Acceptance rate, override reasons, toxicity flags on user text.
- **Rate limiting:** Per-repo budgets; burst control during spam attacks.
- **Retry strategies:** Webhook idempotency keys; safe comment edits.
- **Guardrails and validation:** Block posting secrets; disallow legal threats; respect internal visibility scopes.
- **Security considerations:** Least-privilege GitHub App permissions, audit log of automated edits.

---

## 🚀 Possible Extensions

- **Add UI:** Triage inbox with drag-drop override training.
- **Convert to SaaS:** Multi-tenant triage with per-customer rubrics.
- **Add multi-agent collaboration:** Security vs reliability agents with merge policy.
- **Add real-time capabilities:** Slack triage threads with threaded updates.
- **Integrate with external systems:** Sentry, Datadog, PagerDuty, Linear.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **non-destructive** suggestions before any auto-field updates.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Issue intelligence** pipelines
  - **Evidence-linked** LLM outputs
  - **Human-in-the-loop** for operational risk
  - **System design thinking** for engineering workflows
