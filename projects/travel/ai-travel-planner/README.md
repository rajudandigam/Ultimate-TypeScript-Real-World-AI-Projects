System Type: Multi-Agent  
Complexity: Level 4  
Industry: Travel  
Capabilities: Planning, Retrieval, Decision making, Personalization  

# AI Travel Planner

## 🧠 Overview
This system turns a traveler’s constraints (dates, budget, party composition, mobility needs, pace, and interests) into a **bookable-feasible plan** by coordinating specialized agents for flights, lodging, and activities. A **planner agent** owns the itinerary graph, resolves conflicts between proposals, and keeps the output grounded in tool-backed availability and pricing where APIs allow.

---

## 🎯 Problem
Trip planning products often collapse into a single model call that “sounds good” but fails basic feasibility checks: impossible transfers, mismatched airports, hotels far from chosen activities, budgets that drift after the first message, or recommendations that ignore real inventory and opening hours.

In real travel systems, the hard part is not natural language polish. It is **constraint satisfaction under partial information**, **time geography**, **supplier-specific rules**, and **fresh pricing**—while still personalizing to a household’s preferences and past choices.

---

## 💡 Why This Matters
- **Pain it removes:** Manual cross-checking across tabs, inconsistent handoffs between “inspiration” and “booking,” and brittle automations that cannot explain why a plan changed.
- **Who benefits:** Travel marketplaces, loyalty programs, corporate travel desks, and consumer apps that must integrate multiple supplier APIs without letting the LLM become an implicit database of fares.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Multi-Agent System

A multi-agent split is appropriate because flight search, hotel fit scoring, and activity scheduling have **different tool surfaces, latency profiles, and failure modes**. A dedicated **planner agent** acts as the orchestration and merge layer: it maintains a canonical trip state (nodes, edges, time windows, budget ledger), requests proposals from specialists, and rejects or revises work that violates global constraints.

This is not “multiple personas for fun.” It is **role separation for safer tool access** (flights tools cannot silently rewrite hotel contracts), clearer evaluation (which agent caused a bad layover?), and parallelization (specialists can run concurrently with idempotent proposal IDs).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target for this blueprint:** Level 4. The learning objective is orchestration: shared state, conflict resolution, parallel specialist calls, and merge semantics—while still using RAG and personalization as supporting memory, not as a substitute for supplier tools. Level 5 is what you add when hardening for scale: stronger SLOs, fraud controls, payments, and deeper supplier contracts.

---

## 🏭 Industry
Example:
- Travel (consumer trip planning, OTA-adjacent workflows, loyalty/cobrand experiences)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope**
- Planning — **in scope**
- Reasoning — optional (mostly embedded in planner merge and validation)
- Automation — optional (repricing loops, hold expirations, background refresh jobs)
- Decision making — **in scope**
- Observability — recommended operationally (traces/metrics), not a traveler-facing “feature”
- Personalization — **in scope**
- Multimodal — optional (map imagery, PDFs; not required for the core architecture)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (API workers, orchestration service)
- **OpenAI SDK for TypeScript** or **OpenAI Agents SDK** (structured tool calls, multi-step runs)
- **Vercel AI SDK** (streaming UX if you expose partial plans to a web UI)
- **Mastra** (optional: durable workflows + agent graphs if you want a batteries-included orchestration layer)
- **Next.js + React** (trip editor UI, diff view of plan revisions, human approval gates)
- **Postgres** (canonical trip state, audit log, fare snapshots)
- **Redis** (rate limiting, short-lived supplier session tokens)
- **OpenTelemetry** (trace planner vs specialist spans)
- **MCP SDK** (optional: wrap supplier tools as MCP servers for reuse across clients)

**Representative supplier integrations (pick based on access and contracts):**
- **Flights:** Duffel, Amadeus Self-Service, or airline direct NDC endpoints (availability-dependent)
- **Hotels:** partner APIs (often require commercial agreements) or aggregator APIs your org already licenses
- **Maps / POI / routing:** Google Places / Routes, Mapbox Search / Directions (distance-time feasibility)
- **Activities:** supplier APIs where available; otherwise structured POI catalogs + ticketing deep links with clear “not booked until confirmed” semantics

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** A structured trip request (not only chat): origin/destination, date range, party size, cabin/budget caps, lodging class, mobility constraints, “must-do” anchors, flexibility flags, and preference profile ID.
- **LLM layer:** Four agents with narrow responsibilities:
  - **Planner agent:** owns constraints, merges proposals into a timeline graph, detects conflicts, requests revisions, and produces the user-facing rationale with citations to tool payloads.
  - **Flights agent:** searches itineraries, validates airport consistency, minimum connection times (policy table + API hints), and returns ranked options with opaque pricing snapshots.
  - **Hotels agent:** searches stays aligned to daily geography, applies hard filters (ADA needs, parking, cancellation policy), returns candidates with nightly totals and distance-to-day-centroid scores.
  - **Activities agent:** proposes time-bounded blocks using POI hours, travel time estimates, and reservation windows; never claims a ticket is purchased unless a booking tool confirms.
- **Tools / APIs:** Typed functions per domain (search, details, price check, hold/book where legally/contractually allowed). Planner tools include “apply patch to itinerary graph,” “recompute budget ledger,” “compute slack,” and “request specialist refresh.”
- **Memory (if any):** **RAG** over the traveler’s prior trips, saved lists, and brand policy docs (cancellation rules, preferred carriers); plus structured preference tables for deterministic filtering before generation.
- **Output:** A versioned itinerary artifact (JSON graph + rendered summary), supplier deep links, explicit unknowns (“hotel price not guaranteed until checkout”), and a machine-readable change log for each revision.

Keep this simple and conceptual: the architecture’s goal is **a single source of trip truth** with **specialist-generated patches**, not four independent chats that contradict each other.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Build a **workflow** itinerary generator: deterministic day buckets, fixed templates, and rule-based spacing (lunch block, transit slack). Inputs are structured; output is a draft plan without supplier truth yet (placeholders allowed, but labeled).
- Implement the **trip graph model** early: stops, edges, time windows, costs, and provenance fields (`source: user | tool | inferred`).

### Step 2: Add AI layer
- Add an LLM step that narrates and explains the draft plan, but **cannot invent inventory**. The model only elaborates what the graph already contains.
- Introduce strict schemas for plan patches (JSON Patch or domain-specific operations) and reject invalid graph edits at validation time.

### Step 3: Add tools
- Integrate **maps routing** first (cheap, high leverage): travel times constrain feasibility more than eloquent text ever will.
- Add **flights** and **hotels** search tools behind adapters with normalized result types (currency, taxes/fees fields, refundability flags).
- Add **activities** tools: POI details + hours + booking URLs; treat “booking” as a separate capability gated by permissions.

### Step 4: Add memory or context
- Add **personalization + RAG**: embed and retrieve past trip notes, loyalty constraints, and “never again” patterns (e.g., red-eye avoidance) to bias scoring—not to bypass hard filters.
- Persist **fare/price snapshots** with timestamps so the UI can show staleness honestly.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Split tools across **flights / hotels / activities** agents with **least privilege** tool registries.
- Run specialists **in parallel** for independent days or independent domains, but require the **planner agent** to serialize merges to the canonical graph (optimistic locking + revision IDs).
- Add explicit **negotiation protocol**: specialists return `Proposal { id, ops[], assumptions[], expiresAt }`; planner returns `Accept | RejectWithReason | RequestRevision`.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Feasibility checks pass (no overlapping hard events, airport continuity for chosen flight options, hotel check-in/out aligns to flights, activities within opening hours). Track **constraint violation rate** per 100 plans.
- **Latency:** p50/p95 end-to-end time for “first shoppable draft” and “post-merge finalized plan,” broken down by agent and supplier call.
- **Cost:** Tokens + embeddings + supplier API fees per successful itinerary; measure wasted spend on rejected proposals and rerun loops.
- **User satisfaction:** Task completion (saved itinerary, clicked through to checkout), edit distance (how many manual fixes), qualitative rubric on explanation usefulness.
- **Failure rate:** Tool timeouts, empty searches, merge deadlocks (planner cannot satisfy all specialists), and policy violations caught by validators vs caught by users.

**Strong evaluation extras (worth building early):**
- A **golden set** of trip requests with expected outcomes (hard bans, required layover mins, known construction detours).
- **Shadow mode**: run multi-agent merges without showing users, compare against workflow baseline.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations**
  - Invented flight numbers, nonexistent hotels, wrong terminal claims, or “reserved” activities without a booking record.
  - **Mitigation:** Require supplier identifiers on every bookable element; separate “suggested” vs “verified”; block rendering of ungrounded claims in UI components.

- **Tool failures**
  - Partial results (hotels return, flights API down), stale caches, inconsistent currencies, missing child fares.
  - **Mitigation:** Circuit breakers per supplier, graceful degradation (planner switches to “manual selection required” states), explicit user-visible error taxonomy.

- **Latency issues**
  - Parallel agents amplify tail latency; sequential merges feel slow.
  - **Mitigation:** Streaming partial proposals, deadlines per specialist, caching geocodes/routes, prefetching likely hotel hubs after flight shortlist stabilizes.

- **Cost spikes**
  - Runaway re-queries after each minor edit; embeddings on huge POI dumps per request.
  - **Mitigation:** Budgeted planner loops, dedupe searches by fingerprint, incremental RAG (retrieve only deltas), hard caps with user-prompted tradeoffs (“relax budget” / “narrow neighborhood”).

- **Incorrect decisions**
  - Planner accepts incompatible proposals (overnight flight + early morning tour), or optimizes price while violating accessibility needs.
  - **Mitigation:** A deterministic **validator layer** after every merge (not “prompt harder”): typed rules, testable in CI; accessibility and mobility constraints as non-negotiable predicates.

- **Multi-agent-specific failures**
  - **Inconsistent world models** (two agents assume different city centers), **race conditions** on graph updates, **circular revisions** (flights changes invalidate hotels repeatedly).
  - **Mitigation:** Canonical geospatial references (place IDs), single-writer merge queue, max revision rounds, and “freeze windows” once user approves a segment.

- **Compliance and trust**
  - Hidden affiliate bias, unclear sponsored placement, storing sensitive traveler data incorrectly.
  - **Mitigation:** Disclosure of sponsored inventory, data minimization, retention policies, regional privacy requirements reflected in architecture—not only in legal copy.

---

## 🏭 Production Considerations

- **Logging and tracing:** Propagate a `tripRequestId` across all spans; log proposal IDs, merge decisions, and the exact tool payloads used for price claims (redacted as needed).
- **Observability:** Dashboards for supplier error rates, planner rerun counts, merge rejection reasons, token cost per stage, and “staleness age” of displayed fares.
- **Rate limiting:** Per user, per IP, per API key, and per supplier quota; backoff that does not stampede retries across workers.
- **Retry strategies:** Idempotent searches, deduped webhooks (if any), safe replays for orchestration steps; never double-book via at-most-once booking calls without compensating transactions.
- **Guardrails and validation:** Schema validation for graph ops; allowlists for spend; geofencing for permitted booking regions; human-in-the-loop for first-time high-risk actions (international infant fares, nonrefundable purchases).
- **Security considerations:** Treat supplier keys as secrets; isolate tenant data; prevent SSRF in any “fetch URL” tools; sanitize user-provided links; audit all agent tool invocations; protect traveler PII in RAG chunks (chunking rules + access controls).

---

## 🚀 Possible Extensions

- **Add UI:** Interactive timeline with drag-and-drop blocks that still compile to validated graph operations (not free-text edits that bypass rules).
- **Convert to SaaS:** Multi-tenant supplier credential management, per-tenant policy packs, and billing for search volume.
- **Add multi-agent collaboration:** Add a **policy/compliance agent** for corporate travel rules; add a **payments agent** only if you truly need it—avoid expanding attack surface without revenue justification.
- **Add real-time capabilities:** Live flight delay replanning, push notifications, websocket updates for merge status.
- **Integrate with external systems:** Calendar holds, expense systems, CRM profiles, concierge handoff tickets with attached evidence bundle.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- **Rule-based → LLM:** Start from a structured workflow that outputs a draft graph; use the LLM for explanation and constrained rewriting only after validation exists.
- **LLM → Tool-based:** Add maps and supplier search tools; require identifiers and timestamps on all “facts.”
- **Tool-based → Agent:** Give one orchestrator agent the ability to call tools iteratively within budgets (still single-writer on trip state).
- **Agent → Multi-agent:** Split tools and prompts by domain with a planner merge layer; add parallel proposals, then tighten protocols and evaluation as complexity grows.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multi-agent orchestration** with a canonical state object and merge semantics (avoid “chatty committee” designs)
  - **Tool calling** under domain-scoped permissions (flights tools vs hotel tools)
  - **Retrieval (RAG)** as personalization and policy support, not a replacement for inventory systems
  - **Constraint validation** as shipping-grade engineering (testable rules, not vibes)
  - **System design thinking** for travel: time geography, staleness, supplier heterogeneity, and user trust
