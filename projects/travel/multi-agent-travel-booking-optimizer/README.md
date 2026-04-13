System Type: Multi-Agent  
Complexity: Level 5  
Industry: Travel  
Capabilities: Decision making, Optimization  

# Multi-Agent Travel Booking Optimizer

## 🧠 Overview
A **multi-agent** booking stack where a **flight optimizer**, **hotel recommender**, and **pricing analyzer** produce **structured proposals** under a **supervisor** that enforces budget, policy, and inventory truth—aimed at **shoppable outcomes** (holds/bookings where legally possible) with **audit-grade** decision traces, not conversational trip chat.

---

## 🎯 Problem
Booking is constrained optimization: fares change, inventory is finite, bundles interact (flight time affects hotel night count), and “best deal” without guardrails creates **policy violations** and **support debt**. Single-model prompts cannot own supplier heterogeneity and risk controls.

---

## 💡 Why This Matters
- **Pain it removes:** Suboptimal bundles, opaque price drift, and manual rework when automation ignores cancellation rules or loyalty constraints.
- **Who benefits:** High-volume travel desks, loyalty cobrand teams, and marketplaces integrating multiple supply partners.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Multi-Agent System

**Flight**, **hotel**, and **pricing** have different APIs, update cadences, and failure semantics. Multi-agent separation supports **scoped credentials**, **parallel search**, and **clear accountability** for which subsystem caused a bad recommendation—merged by a **supervisor** with a canonical **offer graph**.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Booking-adjacent automation requires **payments posture**, **fraud controls**, **PCI boundaries**, **A/B pricing ethics**, and **strong rollback** when suppliers disagree.

---

## 🏭 Industry
Example:
- Travel (booking optimization, package bundling, B2B travel programs)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (policy memos, partner fare rules)
- Planning — **in scope** (search waves, merge schedules)
- Reasoning — bounded (tradeoff explanations)
- Automation — **in scope** (holds/bookings where allowed)
- Decision making — **in scope** (select bundle under constraints)
- Observability — **in scope**
- Personalization — optional (tier-based constraints)
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** (supervisor workflows, expiring holds, human approvals)
- **OpenAI Agents SDK** / **Mastra** (multi-agent graphs)
- **Partner APIs** (GDS/NDC/aggregators—contract-dependent)
- **Postgres** (offer graph, audit, price snapshots)
- **Redis** (locks, rate limits)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Multi-Agent Travel Booking Optimizer** (Multi-Agent, L5): prioritize components that match **multi** orchestration and the **travel** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Duffel / Amadeus / airline NDC (availability-dependent)
- Google Places & Routes or Mapbox (routing, POI hours)
- Weather APIs for outdoor risk

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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Trip constraints + risk tier + payment method class + loyalty ids.
- **LLM layer:** Three specialists + supervisor merge; numeric optimization outside LLM for final price comparison where possible.
- **Tools / APIs:** Flight search/book, hotel search/book, tax/fee calculators, fraud scoring hooks.
- **Memory (if any):** Historical price snapshots for analyzer; optional RAG for partner rules.
- **Output:** Ranked bundles with `expires_at`, fare basis metadata, and explicit non-guarantees.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic bundle search with fixed ranking keys; no LLM.

### Step 2: Add AI layer
- LLM narrates bundles and flags tradeoffs using only tool payloads.

### Step 3: Add tools
- Wire real supplier tools behind adapters with timeouts and idempotency keys.

### Step 4: Add memory or context
- Store and retrieve similar past bookings for pricing heuristics (privacy-controlled).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Split specialists and add supervisor merge with validation gates before any purchase tool call.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Constraint violation rate near zero; human audit match on sampled bundles.
- **Latency:** p95 time to first shoppable bundle under peak; supplier tail latency isolated per agent.
- **Cost:** Supplier API + LLM cost per conversion; wasted spend on rejected merges.
- **User satisfaction:** Conversion, support ticket rate, refund/chargeback rate.
- **Failure rate:** Double booking attempts, stale price displays, merge deadlocks.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claimed fares or room types not returned by tools; mitigated by strict schema + supplier id requirements.
- **Tool failures:** Partial supplier outages; mitigated by degraded bundles and explicit gaps.
- **Latency issues:** Parallel fan-out overload; mitigated by deadlines per specialist and circuit breakers.
- **Cost spikes:** Re-query loops after each minor edit; mitigated by fingerprinting and merge batching.
- **Incorrect decisions:** Booking non-refundable incorrectly; mitigated by human gates, dry-run holds, and explicit risk labels.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit for every price snapshot and tool call; PCI boundaries for card data.
- **Observability:** Supplier error taxonomy, merge rejection reasons, fraud score distributions.
- **Rate limiting:** Per partner contract; per user anti-scraping; global concurrency caps.
- **Retry strategies:** Idempotent booking attempts; saga compensations for partial failures.
- **Guardrails and validation:** Policy engine for refunds/cancellations; geo rules; max spend per session.
- **Security considerations:** Vaulted credentials; mTLS to partners; tenant isolation; abuse detection on automated booking.

---

## 🚀 Possible Extensions

- **Add UI:** Bundle diff view with countdown timers for holds.
- **Convert to SaaS:** Multi-tenant partner credential management.
- **Add multi-agent collaboration:** Compliance agent for regulated corporate travel.
- **Add real-time capabilities:** Live repricing with user confirmation gates.
- **Integrate with external systems:** ERP travel approval, expense systems.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep numeric truth in tools and validators; use agents for search + explanation + merge orchestration.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multi-agent** commerce under constraints
  - **Supervisor merge** patterns for offers
  - **Supplier integration** reality in travel
  - **System design thinking** for money-adjacent automation
