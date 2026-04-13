System Type: Agent  
Complexity: Level 4  
Industry: AI Infra  
Capabilities: Optimization  

# RAG Query Rewriting Engine

## 🧠 Overview
A **query understanding service** that turns messy user questions into **retrieval-friendly** variants: **HyDE**-style synthetic passages (when appropriate), **keyword expansions**, **filters** (time, product, tenant), and **decomposition** for multi-hop queries—always returning a **structured `RetrievalPlan`** your vector/keyword stack executes, with **A/B evaluation** hooks to prove lift vs baseline.

---

## 🎯 Problem
Users ask vague questions; embeddings underperform on short queries and miss metadata constraints. Naive rewriting invents facts. You need **schema-bound** plans and **offline eval** before shipping rewrites live.

---

## 💡 Why This Matters
- **Pain it removes:** “RAG feels dumb” complaints that are actually **retrieval query formulation** problems.
- **Who benefits:** Teams operating internal assistants and customer support copilots on heterogeneous corpora.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Query rewriting is a **small bounded agent** with tools like `expand_synonyms`, `propose_filters`, `decompose_subqueries`, `lint_plan`—not a long chat session.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Multi-strategy rewriting, **guardrails**, and **online experimentation**—L5 adds global SLOs, adversarial robustness programs, and full model governance.

---

## 🏭 Industry
Example:
- AI Infra (retrieval quality, search relevance, copilot backends)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (consumes corpus metadata, not necessarily full doc bodies in rewriter)
- Planning — **in scope** (subquery DAG)
- Reasoning — bounded (choose rewrite strategy)
- Automation — optional (scheduled eval runs)
- Decision making — bounded (select filters with confidence)
- Observability — **in scope**
- Personalization — optional (per-tenant synonym packs)
- Multimodal — optional (rewrite image+text queries using structured vision features, not raw pixels in hot path unless needed)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (low-latency API)
- **OpenAI SDK** / small open models for rewrite
- **Postgres** (plans, eval results, feature flags)
- **OpenSearch** / vector store clients
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **RAG Query Rewriting Engine** (Agent, L4): prioritize components that match **agent** orchestration and the **ai-infra** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- OpenAI / Anthropic / multi-vendor model APIs
- Kubernetes or Docker APIs if self-hosted
- OIDC provider for tool consent

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

- **Input (UI / API / CLI):** User query + optional session context + corpus profile id.
- **LLM layer:** Rewriter agent emits `RetrievalPlan` JSON (validated).
- **Tools / APIs:** Ontology lookup, past successful queries (hashed), schema of filterable metadata.
- **Memory (if any):** Per-corpus rewrite policies; negative patterns (“do not expand acronyms X”).
- **Output:** Plan consumed by hybrid search service; logs for eval.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rule-based synonym map + whitespace normalization.

### Step 2: Add AI layer
- LLM proposes 3 query variants; retrieval merges results with RRF.

### Step 3: Add tools
- Add metadata filter proposal tool backed by facet index.

### Step 4: Add memory or context
- Log rewrite outcomes with click/feedback signals for bandit or offline retrain.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist for **legal** vs **engineering** corpus profiles (policy-separated prompts).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** nDCG/MRR uplift vs baseline on labeled sets; citation precision downstream.
- **Latency:** Added rewriter p95 latency budget vs retrieval SLA.
- **Cost:** Tokens per query at traffic levels.
- **User satisfaction:** Thumbs feedback on answers; support deflection proxies.
- **Failure rate:** Harmful expansions, wrong filters excluding all results, injection via malicious corpus text.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented product SKUs in filters; mitigated by facet validation against controlled vocabularies.
- **Tool failures:** Facet index stale; mitigated by freshness timestamps and safe fallback to vector-only.
- **Latency issues:** Too many subqueries; mitigated by caps and early-stop merge rules.
- **Cost spikes:** Long chat histories fed into rewriter; mitigated by summarization and per-request token caps.
- **Incorrect decisions:** Over-broad queries leaking cross-tenant terms; mitigated by strict tenant token injection and tests.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log rewrite strategy codes, not always raw user text (configurable redaction).
- **Observability:** Zero-result rate after rewrite, filter usage distribution, eval dashboards per corpus version.
- **Rate limiting:** Per tenant; detect abusive rewrite loops.
- **Retry strategies:** Deterministic fallback to baseline rewrite on schema validation failure.
- **Guardrails and validation:** JSON Schema for plans; block disallowed operations; PII regex filters on expansions.
- **Security considerations:** Prompt-injection hardening using corpus-boundary delimiters; secret scanning on logged plans.

---

## 🚀 Possible Extensions

- **Add UI:** Playground comparing baseline vs rewritten retrieval hits.
- **Convert to SaaS:** Hosted rewriter with per-tenant policy packs.
- **Add multi-agent collaboration:** Router agent picks among rewriter profiles (latency vs quality).
- **Add real-time capabilities:** Streaming partial plans for responsive UX.
- **Integrate with external systems:** LangSmith, Honeycomb, feature flag services.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Ship **shadow mode** rewrites first; promote only with measured lift.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Query planning** for retrieval
  - **RRF / hybrid merge** patterns
  - **Eval-driven** shipping of NLP components
  - **System design thinking** for low-latency search stacks
