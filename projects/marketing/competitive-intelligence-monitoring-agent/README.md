System Type: Agent  
Complexity: Level 3  
Industry: Marketing  
Capabilities: Monitoring  

# Competitive Intelligence Monitoring Agent

## 🧠 Overview
A **CI agent** that monitors **allowlisted** competitor sources (sites, changelogs, pricing pages, release notes, SEC filings where applicable) via **scheduled fetches** and **change detection**, then produces **battle card deltas** with **citations**—**no** gray-area scraping; **ToS-respecting** ingestion and **human review** for outward-facing claims.

---

## 🎯 Problem
Sales loses deals to surprise launches; teams learn competitor moves from random Slack screenshots instead of structured intel.

---

## 💡 Why This Matters
- **Pain it removes:** Stale battle cards, inconsistent positioning, and slow competitive response.
- **Who benefits:** Product marketing, PMM, and sales enablement in competitive categories.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Workflows handle fetch/diff; agent summarizes **structured diffs** into **card updates** with evidence links.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Retrieval over internal positioning + external change feeds + synthesis; L4+ adds multi-agent (facts vs narrative) with conflict logging.

---

## 🏭 Industry
Example:
- Marketing / competitive intelligence

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal positioning docs, win/loss notes
- Planning — bounded (weekly intel digest structure)
- Reasoning — bounded (implications for pitch)
- Automation — Slack/Notion updates, ticket creation
- Decision making — bounded (severity of change)
- Observability — **in scope**
- Personalization — per-vertical battle cards
- Multimodal — optional screenshot diff of pricing pages (policy gated)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**, **Inngest**/**Temporal** for pollers
- **Playwright** only where permitted; prefer **RSS/APIs**
- **Postgres** + **diff** store; **OpenAI SDK** for summaries
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Competitive Intelligence Monitoring Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **marketing** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SendGrid / SES / customer.io for outbound
- Meta / Google Ads APIs (only if ads are in-scope)
- YouTube / podcast hosting APIs when media ingestion applies

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
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

- **Input (UI / API / CLI):** Watchlist registry, frequency, legal-approved domains.
- **LLM layer:** Agent turns `ChangeEvent[]` into battle card patch proposals.
- **Tools / APIs:** Fetchers, HTML/text diff, SEC EDGAR (where used legally), news APIs (licensed).
- **Memory (if any):** Versioned battle cards; embedding index over internal win stories.
- **Output:** Slack digest + Notion page update PR (human merge).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual RSS reader links in Notion.

### Step 2: Add AI layer
- LLM summarizes a pasted diff text for PMM.

### Step 3: Add tools
- Automated diff pipeline with hash-stable storage and rollback.

### Step 4: Add memory or context
- Link changes to CRM win/loss tags for relevance ranking.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Separate **fact extractor** vs **narrative writer** with citation enforcement.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human-verified precision of claimed changes vs ground truth spot checks.
- **Latency:** Time from competitor publish to first internal alert within SLO.
- **Cost:** Fetch + storage + LLM $ per competitor per month.
- **User satisfaction:** Sales usage of updated cards in calls; win rate deltas (hard causal).
- **Failure rate:** False change alerts (A/B noise), legal issues from disallowed scraping.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Misread pricing; require DOM snapshot or structured extract + human ack for $ claims.
- **Tool failures:** Bot blocks; rotate to official APIs or pause with explicit reason.
- **Latency issues:** Large pages; extract main content server-side before LLM.
- **Cost spikes:** Too-frequent polls; exponential backoff and importance tiers.
- **Incorrect decisions:** Publishing unverified rumors; source reputation scoring + dual review for externals.

---

## 🏭 Production Considerations

- **Logging and tracing:** URL, checksum, extractor version; minimize storing full HTML if not needed.
- **Observability:** Fetch success %, diff noise rate, alert fatigue metrics.
- **Rate limiting:** Per-domain politeness; global concurrency caps.
- **Retry strategies:** Idempotent event ids for same content hash.
- **Guardrails and validation:** Legal allowlist; PII scrubbing from captured pages; watermark “unverified” states.
- **Security considerations:** Secrets for licensed feeds, tenant isolation for multi-product companies.

---

## 🚀 Possible Extensions

- **Add UI:** Timeline of competitor feature launches vs yours.
- **Convert to SaaS:** CI platform for mid-market SaaS.
- **Add multi-agent collaboration:** PMM editor agent with style constraints only.
- **Add real-time capabilities:** Webhooks from partner data shares where available.
- **Integrate with external systems:** Klue, Crayon, Gong competitive trackers.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **compliant ingestion + citations** before broad web automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Ethical competitive** data collection
  - **Diff-driven** intelligence pipelines
  - **Enablement** content lifecycle
  - **System design thinking** for PMM ops
