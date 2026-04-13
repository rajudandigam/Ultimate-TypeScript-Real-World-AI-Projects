System Type: Agent  
Complexity: Level 2  
Industry: Productivity  
Capabilities: Generation  

# Intelligent Email Drafting Assistant

## 🧠 Overview
A **writing agent** that drafts **thread-aware emails** using **retrieved prior messages**, **tone presets**, and **user goals**—outputs are **drafts in the composer** with **citations to source lines** where facts are pulled from the thread. It does **not** send mail or impersonate signatures without explicit user action.

---

## 🎯 Problem
Replying with the right tone and completeness is slow; blank-page syndrome hits even senior operators, especially across **long threads** and **multi-language** teams.

---

## 💡 Why This Matters
- **Pain it removes:** Slow responses, inconsistent voice, and missed action items buried in history.
- **Who benefits:** Sales, support leads, and managers living in Gmail/Outlook-heavy workflows.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `fetch_thread`, `extract_action_items`, `apply_tone`, `translate` (optional).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Thread tools + tone presets; L3+ adds org-wide style RAG and compliance classifiers for regulated industries.

---

## 🏭 Industry
Example:
- Productivity / workplace communication

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — thread snippets, snippets from CRM (optional)
- Planning — bounded (outline before draft)
- Reasoning — bounded (clarify ambiguous asks)
- Automation — optional scheduled “nudge draft” reminders (opt-in)
- Decision making — bounded (tone selection)
- Observability — **in scope**
- Personalization — saved voice profiles
- Multimodal — optional attachment summarization (policy gated)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** add-in backend
- **Gmail API** / **Microsoft Graph** Mail (read scopes minimized)
- **OpenAI SDK** streaming completions
- **Postgres** for tone presets and audit metadata
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Intelligent Email Drafting Assistant** (Agent, L2): prioritize components that match **agent** orchestration and the **productivity** integration surface.

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

- **Input (UI / API / CLI):** User goal text, tone chip, selected thread id.
- **LLM layer:** Agent composes draft with optional tool prefetch.
- **Tools / APIs:** Mail provider read APIs; CRM link fetchers if allowed.
- **Memory (if any):** Short session buffer; optional user phrase bank.
- **Output:** Draft HTML/text inserted into client composer.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template replies from three macros (no LLM).

### Step 2: Add AI layer
- LLM rewrites selected paragraph for tone.

### Step 3: Add tools
- Pull last N messages safely; redact PII classes before model.

### Step 4: Add memory or context
- Learn banned phrases / required disclaimers per org.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional compliance reviewer for external-boundary mail.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human edit distance; factual alignment checks on labeled threads.
- **Latency:** p95 draft time for typical threads.
- **Cost:** Tokens per draft; cache hit on repeated boilerplate.
- **User satisfaction:** Send rate of AI-assisted drafts vs discard.
- **Failure rate:** Wrong recipient suggestions, hallucinated commitments, policy violations.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Promises not in thread; require user-attested facts or quote mode.
- **Tool failures:** Mail API scopes missing; graceful degrade to user-pasted excerpt only.
- **Latency issues:** Long threads; hierarchical summarization server-side first.
- **Cost spikes:** Auto-draft on every new mail; strict user triggers only in v1.
- **Incorrect decisions:** Leaking confidential recipients in suggestions; BCC discipline and domain rules.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log draft metadata ids, not full bodies if policy forbids.
- **Observability:** Model refusal reasons, redaction counts, abuse detection on bulk export.
- **Rate limiting:** Per mailbox; detect compromised tokens.
- **Retry strategies:** Idempotent draft save keys in client.
- **Guardrails and validation:** DLP scanning on outputs; block exfiltration patterns.
- **Security considerations:** OAuth least privilege, tenant isolation, legal hold compatibility.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side diff vs original suggestion.
- **Convert to SaaS:** Cross-provider email copilot.
- **Add multi-agent collaboration:** Translator + editor chain.
- **Add real-time capabilities:** Streaming tokens into composer.
- **Integrate with external systems:** Salesforce, HubSpot, Notion context.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **draft-only** and **minimal read scopes**.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Mail API** integration patterns
  - **Thread-grounded** generation
  - **DLP-aware** UX
  - **System design thinking** for communication copilots
