System Type: Agent  
Complexity: Level 4  
Industry: Travel  
Capabilities: Validation, Decision-making  

# Corporate Travel Policy Enforcer

## 🧠 Overview
A **single policy agent** that evaluates travel requests and bookings against **versioned corporate rules** (class of service, advance purchase, preferred vendors, per-diem geography), returns **allow / deny / needs approval** with **cited rule clauses**, and drafts **exception requests**—integrating with approval workflows without letting the LLM become the system of record for policy text.

---

## 🎯 Problem
Policy PDFs drift from reality; approvers rubber-stamp out of fatigue. Employees game free-text fields. You need **deterministic rule evaluation** for compliance plus **language UX** for explanations and exception narratives grounded in authoritative policy stores.

---

## 💡 Why This Matters
- **Pain it removes:** Audit findings, overspend, slow approvals, and inconsistent manager decisions.
- **Who benefits:** Finance, travel managers, and TMCs serving mid-market and enterprise clients.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Policy enforcement is one **accountable surface** with tools: `evaluate_rules_engine`, `fetch_policy_version`, `route_approval`, `log_decision`. Multi-agent rarely helps unless splitting **risk scoring** from **customer wording** under strict isolation.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You combine **rules + retrieval** over policy corpora, **multi-level approvals**, and **audit-grade** logging—production hardening to L5 adds global policy governance and formal certification workflows.

---

## 🏭 Industry
Example:
- Travel (corporate travel, expense policy, duty of care adjacent)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (policy clauses, FAQs—version pinned)
- Planning — bounded (approval path suggestions)
- Reasoning — bounded (explain conflicts between rules)
- Automation — **in scope** (route to approvers, pre-fill tickets)
- Decision making — **in scope** (recommendation; rules engine is authority)
- Observability — **in scope**
- Personalization — optional (role-based policy views)
- Multimodal — optional (invoice images routed to OCR workflow, not raw LLM vision for verdict)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (traveler and approver UI)
- **Node.js + TypeScript**
- **Open Policy Agent (OPA)** or custom JSON rules + **Postgres** (versions, decisions)
- **OpenAI SDK** (structured explanations with `rule_id` citations)
- **Temporal** / **Inngest** (approval SLAs, escalations)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Corporate Travel Policy Enforcer** (Agent, L4): prioritize components that match **agent** orchestration and the **travel** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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

- **Input (UI / API / CLI):** Booking intents, itinerary changes, exception forms.
- **LLM layer:** Agent explains engine outcomes and drafts human-readable exception narratives.
- **Tools / APIs:** Rules evaluation, HR directory (role/grade), approval inbox, TMC booking APIs (read).
- **Memory (if any):** Per-employee entitlements cache; prior approved exceptions (governed).
- **Output:** Decision payloads to booking tools, audit records, approver notifications.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Pure rules engine with UI; no LLM.

### Step 2: Add AI layer
- LLM rephrases deny reasons from structured violation codes only.

### Step 3: Add tools
- Add retrieval over policy corpus with mandatory version metadata in responses.

### Step 4: Add memory or context
- Surface similar past exceptions (redacted) for approver context.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional separate “risk narrative” model with no write tools.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Agreement between engine and human audit samples; false allow rate (critical KPI).
- **Latency:** p95 time to decision for typical requests.
- **Cost:** Tokens per decision at volume.
- **User satisfaction:** Traveler clarity scores; approver time saved.
- **Failure rate:** Wrong policy version applied, missing escalation paths.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Citing nonexistent policy sections; mitigated by mandatory `rule_id` from engine or retrieval spans only.
- **Tool failures:** HR directory stale; mitigated by freshness checks and default-safe deny/escalate.
- **Latency issues:** Large policy PDFs; mitigated by chunking, pre-indexing, and query budgets.
- **Cost spikes:** Re-summarizing entire handbook per click; mitigated by caching pinned versions per tenant.
- **Incorrect decisions:** Allowing out-of-policy premium cabin; mitigated by dual control for overrides, spend caps, and immutable audit.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log rule version, inputs hash, engine output, model explanation IDs—not sensitive trip details unless required.
- **Observability:** Override rates, SLA breaches on approvals, drift when policy updates ship.
- **Rate limiting:** Per user and per API key; detect abuse of exception endpoint.
- **Retry strategies:** Idempotent decision writes; safe replays for webhook retries.
- **Guardrails and validation:** Never let model output bypass engine; schema-validate all actions.
- **Security considerations:** RBAC, segregation of duties, encryption, regional data residency for HR fields.

---

## 🚀 Possible Extensions

- **Add UI:** Approver diff view comparing request vs policy clauses.
- **Convert to SaaS:** Multi-tenant policy studio with simulation mode.
- **Add multi-agent collaboration:** Duty-of-care agent read-only for high-risk destinations.
- **Add real-time capabilities:** Live re-validation when GDS prices or cabin change mid-booking.
- **Integrate with external systems:** Workday, SAP Concur, Navan, Amex GBT APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep the **rules engine authoritative**; the agent is for UX and routing, not silent lawmaking.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Policy-as-code** vs LLM judgment
  - **Citation-grounded** enterprise UX
  - **Approval workflow** design
  - **System design thinking** for compliance-adjacent travel
