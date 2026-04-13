System Type: Multi-Agent  
Complexity: Level 4  
Industry: Travel  
Capabilities: Automation, Decision-making  

# Travel Disruption Response System

## 🧠 Overview
A **multi-agent** operations stack that **detects** flight and hotel disruptions from feeds and bookings, **coordinates** rebooking and messaging, and **drives** compensation or claims workflows where policy allows—always with **human escalation** for high-impact changes, fare-rule edge cases, and regulated passenger rights scenarios.

---

## 🎯 Problem
Disruptions spike simultaneously; travelers miss connections while support queues overflow. One monolithic bot either over-promises rebooking or freezes on ambiguous airline rules. You need **role separation** (monitoring vs execution vs customer comms) and **durable workflows** so partial failures do not strand half-updated itineraries.

---

## 💡 Why This Matters
- **Pain it removes:** Hours on hold, duplicate charges, inconsistent policy application, and opaque status after a delay.
- **Who benefits:** TMCs (travel management companies), OTAs with after-sales teams, and enterprise travel desks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Multi-Agent

Split responsibilities: a **disruption detector** correlates signals; a **rebooking optimizer** proposes constrained alternatives; a **compensation / case agent** drafts claims packets and ticket updates—**supervised** by workflows for approvals, idempotency, and audit.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You are orchestrating agents, GDS or OTA APIs, and policy engines with measurable SLAs—not yet full global HA and regulatory program maturity unless you extend to L5.

---

## 🏭 Industry
Example:
- Travel (post-booking operations, disruption management, corporate travel)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (carrier contract snippets, internal policy KB)
- Planning — **in scope** (rebooking sequences, contingency paths)
- Reasoning — bounded (tradeoffs across price, time, policy)
- Automation — **in scope** (case updates, templated outreach)
- Decision making — **in scope** (rank alternatives; human gate for spend)
- Observability — **in scope**
- Personalization — optional (traveler tier, seat preferences)
- Multimodal — optional (screenshot of boarding pass—careful PII)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** / **Inngest** (incident workflows, timers, sagas)
- **Postgres** (incidents, bookings snapshot, audit)
- **OpenAI Agents SDK** or **Vercel AI SDK** (multi-agent orchestration)
- **Flight/hotel APIs** (partner-specific adapters)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Travel Disruption Response System** (Multi-Agent, L4): prioritize components that match **multi** orchestration and the **travel** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
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

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** GDS/OTA webhooks, polling jobs, traveler chat, ops console.
- **LLM layer:** Specialist agents with scoped tools (read vs write separated).
- **Tools / APIs:** Schedule change feeds, availability search, ticketing actions, CRM, email/SMS.
- **Memory (if any):** Per-trip context, prior disruption outcomes, policy exceptions (governed).
- **Output:** Confirmed or proposed itinerary changes, customer notifications, internal case records.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Ingest schedule changes; create tickets for humans only.

### Step 2: Add AI layer
- LLM summarizes disruption impact from structured PNR facts.

### Step 3: Add tools
- Add search-and-hold tools with explicit expiry and fare quote capture.

### Step 4: Add memory or context
- Retrieve similar past cases for playbook hints (no PII in prompts by default).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Split detector / rebooker / compensation agents; supervisor workflow merges outputs.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Correct detection of passenger impact vs noise; human override rate on rebook proposals.
- **Latency:** Time from disruption signal to first customer message under load.
- **Cost:** LLM + API cost per handled incident.
- **User satisfaction:** CSAT, repeat contact rate, NPS after disruption.
- **Failure rate:** Wrong passenger notified, double ticketing, policy violations.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented flights or fare classes; mitigated by tool-backed availability only and schema validation.
- **Tool failures:** GDS timeouts during IRROPS peaks; mitigated by queues, backoff, and honest “pending” states.
- **Latency issues:** Sequential searches across carriers; mitigated by parallel bounded searches and caching.
- **Cost spikes:** Re-embedding entire policy libraries per ping; mitigated by incremental retrieval and hashing.
- **Incorrect decisions:** Auto-canceling wrong segment; mitigated by dry-run diff UI for ops, idempotent commands, mandatory human approval above spend thresholds.

---

## 🏭 Production Considerations

- **Logging and tracing:** Tamper-evident audit of every ticketing attempt; minimize PNR data in logs.
- **Observability:** Queue depth, API error taxonomy, time-to-notify, compensation approval latency.
- **Rate limiting:** Per tenant and per carrier API contract limits.
- **Retry strategies:** Idempotent rebooking with external confirmation IDs; saga compensations on partial failure.
- **Guardrails and validation:** Block autonomous refunds above policy; EU261-style rights as **rules + legal review**, not model law.
- **Security considerations:** OAuth to carriers, secrets rotation, fraud checks on refund destinations, SOC2-ready access controls.

---

## 🚀 Possible Extensions

- **Add UI:** Ops war room with diffable itinerary timelines per traveler.
- **Convert to SaaS:** Multi-tenant TMC offering with per-client policy packs.
- **Add multi-agent collaboration:** Airline-specific sub-agents behind capability flags.
- **Add real-time capabilities:** Push notifications and in-app live updates.
- **Integrate with external systems:** Slack/Teams for travel managers, expense tools for receipt of change fees.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start in **advisory** mode (recommendations + drafts) before any autonomous ticketing.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **IRROPS** operations modeling
  - **Multi-agent** tool scoping and supervisor patterns
  - **Saga-style** booking changes under partial failure
  - **System design thinking** for regulated, high-stakes automation
