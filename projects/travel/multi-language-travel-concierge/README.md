System Type: Agent  
Complexity: Level 3  
Industry: Travel  
Capabilities: Multilingual, Memory  

# Multi-Language Travel Concierge

## 🧠 Overview
A **conversational travel agent** that supports **multiple locales** end-to-end (ASR/TTS or chat), maintains **trip-scoped memory** (itinerary facts, preferences, open bookings), and grounds answers in **live tools** (schedules, maps, policies)—designed so language switching mid-trip does not lose state or invent inventory.

---

## 🎯 Problem
Travelers switch languages; support bots lose thread context or hallucinate availability. Product teams bolt on translation instead of modeling **locale-aware content**, **RTL layouts**, and **consistent memory keys** independent of surface language.

---

## 💡 Why This Matters
- **Pain it removes:** Fragmented chat history, wrong currency or date formats, and unsafe “I booked it for you” claims without receipts.
- **Who benefits:** Global OTAs, airlines, and hotel groups serving multilingual markets from one platform.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Concierge UX is a **single thread** with **session + trip memory** and multilingual prompts. Multi-agent is optional only for **handoff** to human agents with structured summaries.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Focus on **memory**, **retrieval** over KB snippets, and **tool-backed** travel facts; L4+ adds deeper orchestration and enterprise controls.

---

## 🏭 Industry
Example:
- Travel (customer support, concierge, in-trip assistance)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (FAQ, destination rules, partner policies)
- Planning — bounded (day plans from confirmed bookings)
- Reasoning — bounded (clarify ambiguous requests)
- Automation — optional (send itinerary PDF, create calendar events)
- Decision making — bounded (suggest options; booking via tools with confirm)
- Observability — **in scope**
- Personalization — **in scope** (locale, dietary, accessibility notes)
- Multimodal — optional (image of ticket → structured extract via OCR pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (i18n routing, `next-intl` or similar)
- **Node.js + TypeScript**
- **Redis** + **Postgres** (session, trip state, summaries)
- **OpenAI SDK** (structured outputs; multilingual models)
- **Booking/status APIs** as tools
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Multi-Language Travel Concierge** (Agent, L3): prioritize components that match **agent** orchestration and the **travel** integration surface.

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

- **Input (UI / API / CLI):** Chat, voice gateway, mobile SDK.
- **LLM layer:** Agent with locale-aware system instructions and **canonical internal schema** (IDs, UTC times).
- **Tools / APIs:** Flight status, hotel reservations, maps, human handoff.
- **Memory (if any):** Trip summary checkpoints; per-user language preference; consent flags.
- **Output:** Localized natural language + structured actions for UI chips.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fixed FAQ bot per language; no cross-session memory.

### Step 2: Add AI layer
- Single model with explicit `user_locale` and `response_locale` parameters.

### Step 3: Add tools
- Add read-only booking lookup and live status tools.

### Step 4: Add memory or context
- Store rolling trip summary updated after each confirmed fact from tools.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional human-agent handoff subflow with shared JSON handoff packet.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Factual correctness vs tool responses on labeled dialogs across languages.
- **Latency:** p95 response time per locale under typical load.
- **Cost:** Tokens per session; translation fallback usage.
- **User satisfaction:** CSAT by locale; containment vs human transfer.
- **Failure rate:** Language confusion, lost context after switch, wrong airport codes.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claiming upgrades or refunds not in systems; mitigated by receipts and “pending” states only.
- **Tool failures:** Regional API outages; mitigated by graceful messaging and cached last-known-good with timestamps.
- **Latency issues:** Long RAG over huge KBs; mitigated by trip-scoped retrieval filters.
- **Cost spikes:** Voice + long context per message; mitigated by summarization and turn budgets.
- **Incorrect decisions:** Wrong visa advice; mitigated by official-source retrieval, disclaimers, and escalation for legal-sensitive topics.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log locale, model version, tool call IDs; minimize PII in free-text logs.
- **Observability:** Per-locale error rates, handoff reasons, hallucination flags from evaluators.
- **Rate limiting:** Per session and per IP; antifraud on account linking.
- **Retry strategies:** Idempotent tool calls; safe session resume after disconnect.
- **Guardrails and validation:** Block autonomous ticket purchases without explicit confirm UI; content safety across cultures.
- **Security considerations:** PNR access controls, step-up auth for changes, GDPR/CCPA deletion for transcripts.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side map + itinerary with language toggle without state reset.
- **Convert to SaaS:** White-label concierge for hotel apps.
- **Add multi-agent collaboration:** Separate “duty of care” read-only agent for risk alerts.
- **Add real-time capabilities:** Push gate changes and re-ground answers live.
- **Integrate with external systems:** WhatsApp Business, LINE, WeChat, airline messaging APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **memory correctness** and **tool grounding** before expanding automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Locale-aware** agent design
  - **Canonical data** vs localized presentation
  - **Session memory** hygiene for travel PII
  - **System design thinking** for global user bases
