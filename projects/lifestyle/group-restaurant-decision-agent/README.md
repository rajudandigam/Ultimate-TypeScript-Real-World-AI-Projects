System Type: Multi-Agent  
Complexity: Level 3  
Industry: Lifestyle  
Capabilities: Decision making  

# Group Restaurant Decision Agent

## 🧠 Overview
Helps a **friend group or team** pick where to eat when everyone has **different diets, budgets, and distance tolerance**. A **short-lived multi-agent session** collects structured preferences, scores venues from **maps/reviews APIs**, and returns a **ranked shortlist** with **tradeoff explanations**—no single “magic prompt”; the flow is **multi-step** with **human final vote**.

---

## 🎯 Problem
Group chats spiral (“I’m fine with anything” → then vetoes). Manual polling is slow and ignores constraints like **gluten-free**, **halal**, or **$15 caps**.

---

## 💡 Why This Matters
- **Pain it removes:** Decision fatigue and last-minute “we missed the reservation” moments.
- **Who benefits:** Office lunch crews, travel groups, and family weekend planners.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — separate concerns for **preference intake**, **venue retrieval**, and **consensus scoring** coordinated by a **facilitator** with a fixed turn budget.

---

## ⚙️ Complexity Level
**Target:** Level 3 — tool-backed search, constraint solving, and session state.

---

## 🏭 Industry
Lifestyle / consumer social

---

## 🧩 Capabilities
Decision making, Planning, Personalization, Retrieval, Automation

---

## 🛠️ Suggested TypeScript Stack
Next.js or Expo, Node.js BFF, Postgres (sessions + votes), Google Places / Yelp (licensed), Redis rate limits, OpenAI Agents SDK, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Group Restaurant Decision Agent** (Multi-Agent, L3): prioritize components that match **multi** orchestration and the **lifestyle** integration surface.

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
Create session → invite links → parallel preference forms → **Facilitator** merges constraints → **Venue Agent** queries APIs → **Scoring Agent** ranks → push shortlist → optional calendar hold

---

## 🔄 Implementation Steps
1. Manual ranked list from static JSON venues  
2. Add Places search within bounding box  
3. Add per-person veto tags and hard filters  
4. Multi-agent scoring with explainable feature vector  
5. Reservation deep links + “split bill later” handoff  

---

## 📊 Evaluation
Time-to-shortlist, % sessions reaching a pick, NDCG vs post-hoc group satisfaction survey, API cost per session

---

## ⚠️ Challenges & Failure Cases
Stale hours/closed venues; **biased review summaries**; one person dominating—freshness TTL on results, cite review counts, facilitator caps talkative agents, show **why** a venue dropped out

---

## 🏭 Production Considerations
OAuth for maps providers, abuse prevention on public invite links, GDPR deletion for session transcripts, tos-compliant data use

---

## 🚀 Possible Extensions
Recurring “Tues lunch club” memory with rotating fairness (who picked last time)

---

## 🔁 Evolution Path
Form-only → single agent ranker → multi-agent facilitator → org SSO + expense integration

---

## 🤖 Agent breakdown
- **Facilitator agent:** owns session state, turn order, and merge rules; never calls maps directly.  
- **Preference normalizer agent:** converts messy free-text into typed constraints (diet, price, distance).  
- **Venue retrieval agent:** calls Places/search tools with hard filters (open now, rating floor).  
- **Consensus scorer agent:** combines utilities; outputs ranked list + dissent notes for outliers.

---

## 🎓 What You Learn
Small-group decision systems, constraint-aware retrieval, multi-agent facilitation without runaway autonomy
