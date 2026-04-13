System Type: Agent  
Complexity: Level 4  
Industry: Gaming / Interactive Systems  
Capabilities: Reasoning  

# AI NPC Behavior Engine

## 🧠 Overview
A **runtime NPC behavior** subsystem where an LLM-backed **agent chooses actions** from a **closed set** of game-legal affordances (animations, bark lines, ability selections) using **structured world state**—aimed at **dynamic dialogue and tactics** without giving NPCs unrestricted text-to-player channels or **non-deterministic** economy-breaking side effects unless designers explicitly allow them.

---

## 🎯 Problem
Hand-authored behavior trees cover common cases but miss emergent player creativity. Raw LLM NPCs leak setting inconsistencies, produce unsafe content, and are **non-testable**. You need **designer guardrails**, **budgets**, and **telemetry** for live games.

---

## 💡 Why This Matters
- **Pain it removes:** Stale NPC lines, repetitive combat patterns, and expensive bespoke scripting for edge cases.
- **Who benefits:** Mid-size studios building RPGs, immersive sims, and live service titles with moderation requirements.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Each NPC (or squad) runs a **single decision agent** with tools like `query_visible_state`, `select_action_id`, `emit_bark_from_library`. Multi-agent is optional for **party AI** coordination, often better as **deterministic** group planners with occasional LLM flavor.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Shipping in players’ hands implies **moderation**, **latency SLOs**, **A/B evaluation**, and **design tooling**—L5 adds full liveops hardening and anti-cheat integration breadth.

---

## 🏭 Industry
Example:
- Gaming / Interactive Systems (NPC AI, companion characters, enemy commanders)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (lore docs for writers—careful spoilers)
- Planning — bounded (multi-step combat intents)
- Reasoning — **in scope** (tactical choices)
- Automation — bounded (select canned actions)
- Decision making — **in scope** (utility-based choice among allowed actions)
- Observability — **in scope**
- Personalization — optional (player skill adaptation)
- Multimodal — optional (voice barks with TTS policies)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (authoring tools) + **game engine glue** (C#/C++/Rust interop as needed)
- **Redis** (session state for match servers)
- **OpenAI API** (low-latency models; caching)
- **Feature flags** / **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI NPC Behavior Engine** (Agent, L4): prioritize components that match **agent** orchestration and the **gaming** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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

- **Input (UI / API / CLI):** Game tick summaries, player actions, designer policy tables.
- **LLM layer:** NPC agent selects from enumerated actions + optional templated dialogue slots.
- **Tools / APIs:** World snapshot queries, animation catalog, moderation filter, telemetry sink.
- **Memory (if any):** Short-term encounter memory; long-term “relationship score” as numbers, not raw chat logs by default.
- **Output:** Server-validated intent packets applied by simulation authoritative layer.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Scripted NPCs only; telemetry hooks.

### Step 2: Add AI layer
- LLM picks bark lines from approved list IDs.

### Step 3: Add tools
- Add tactical query tools returning numeric features (range, LOS, cooldowns).

### Step 4: Add memory or context
- Maintain compact encounter state vector updated each tick.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional squad coordinator agent with strict bandwidth to clients.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Designer rubric scores on behavior appropriateness; win-rate fairness in PvE tests.
- **Latency:** p95 decision time per NPC budget per frame/tick.
- **Cost:** Tokens per player-hour at concurrency targets.
- **User satisfaction:** Qualitative fun scores; report rates for weird/bad lines.
- **Failure rate:** Moderation escapes; desyncs between client prediction and server truth.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Selecting nonexistent action IDs; mitigated by strict JSON schema + server validation.
- **Tool failures:** Model timeouts mid-fight; mitigated by fallback behavior tree leaf.
- **Latency issues:** Too many NPCs querying LLM; mitigated by hierarchical AI (only elites use LLM).
- **Cost spikes:** Global LLM on every tick; mitigated by event-driven triggers and caching similar states.
- **Incorrect decisions:** NPCs breaking quests; mitigated by quest-critical flags that disable risky actions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log action IDs and prompts hashes, not raw player PII.
- **Observability:** Timeout rates, moderation blocks, encounter funnels, desync counters.
- **Rate limiting:** Per match and per NPC class; backoff under provider incidents.
- **Retry strategies:** Single retry then deterministic fallback; never soft-lock encounters.
- **Guardrails and validation:** Content filters; locale-specific policies; age rating compliance.
- **Security considerations:** Prompt injection via player names; sanitize inputs; server authority for outcomes.

---

## 🚀 Possible Extensions

- **Add UI:** Designer “policy studio” to tune affordances per archetype.
- **Convert to SaaS:** Cloud NPC authoring for indie teams with shared moderation packs.
- **Add multi-agent collaboration:** Separate writer-facing tool vs runtime executor (offline/online split).
- **Add real-time capabilities:** Streaming partial intents for responsive barks.
- **Integrate with external systems:** Analytics (Snowplow-like), liveops CMS, voice pipelines.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **barks-only** before tactical LLM in competitive contexts.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Affordance-constrained** LLM control for games
  - **Server authority** and anti-desync patterns
  - **Moderation** in user-generated adjacent contexts (player names)
  - **System design thinking** for shipped interactive entertainment
