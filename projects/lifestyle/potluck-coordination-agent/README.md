System Type: Multi-Agent  
Complexity: Level 3  
Industry: Lifestyle / Events  
Capabilities: Coordination  

# Potluck Coordination Agent

## 🧠 Overview
Coordinates **who brings what** for a potluck so the **menu balances** (protein, veg, dessert), **avoids duplicate mains**, and respects **allergies** and **kitchen capacity** (two ovens, one fridge shelf). Uses **short-lived multi-agent roles** to propose assignments, detect conflicts, and negotiate swaps—hosts approve the final roster.

---

## 🎯 Problem
Shared spreadsheets go stale; people double-book mac and cheese; allergens get lost in chat scrollback.

---

## 💡 Why This Matters
- **Pain it removes:** Awkward last-minute runs to the store and unsafe food surprises.
- **Who benefits:** Hosts, office party planners, and school event volunteers.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Menu architect**, **Assignment agent**, and **Conflict mediator** with a **host supervisor** budget.

---

## ⚙️ Complexity Level
**Target:** Level 3 — constraint satisfaction with human override.

---

## 🏭 Industry
Lifestyle / social coordination

---

## 🧩 Capabilities
Coordination, Planning, Decision making, Automation, Personalization

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres (event + RSVPs), Redis locks, OpenAI Agents SDK, email/SMS via Resend/Twilio, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Potluck Coordination Agent** (Multi-Agent, L3): prioritize components that match **multi** orchestration and the **lifestyle** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

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
Create event → guests submit dish intents + constraints → agents propose slotting → host edits → lock roster → reminder cron before event

---

## 🔄 Implementation Steps
1. Static category slots (appetizer/main/side/dessert)  
2. Duplicate detection on dish embeddings + exact text  
3. Allergen tagging with required acknowledgments  
4. Swap negotiation chat with mediator agent  
5. Print-friendly shopping quantities for shared items  

---

## 📊 Evaluation
% balanced menus achieved, duplicate rate post-lock, host edit count, guest satisfaction quick-poll

---

## ⚠️ Challenges & Failure Cases
Guests ghost RSVPs; **conflicting allergy** (nuts vs may contain); mediator suggests culturally insensitive pairings—deadline escalation, explicit allergen matrix, tone/style guidelines in mediator prompts

---

## 🏭 Production Considerations
PII minimization, child events require guardian consent mode, spam prevention on public invite links

---

## 🚀 Possible Extensions
Store-circular integration for “host buys bulk drinks” line items

---

## 🔁 Evolution Path
Spreadsheet template → single-agent suggestions → multi-agent negotiation → recurring club events with fairness memory

---

## 🤖 Agent breakdown
- **Menu architect agent:** proposes target counts per category from headcount + duration.  
- **Assignment agent:** maps people → slots using preferences and equipment notes.  
- **Mediator agent:** resolves collisions (“two lasagnas”) with swap offers and host-friendly rationale.

---

## 🎓 What You Learn
Constraint-heavy coordination UX, small multi-agent negotiation, event-driven reminders
