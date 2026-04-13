System Type: Agent  
Complexity: Level 3  
Industry: Real Estate  
Capabilities: Matching  

# Smart Property Matching System

## 🧠 Overview
Matches **buyers/renters** to **listings** using **structured prefs** (budget, commute, schools, must-haves) + **vector search** over listing text and **hard filters** (beds, HOA, pet policy)—agent explains **why** each match with **citable listing fields**; **Fair Housing** compliance blocks discriminatory user filters and **steering** language.

---

## 🎯 Problem
Portal search UX frustrates users; agents waste time on poor-fit tours; sensitive criteria need careful handling.

---

## 💡 Why This Matters
Better matches increase conversion and satisfaction while reducing compliance risk.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) with **rules engine** for hard constraints.

---

## ⚙️ Complexity Level
**Target:** Level 3. Hybrid retrieval + reranking + explanations; L4+ adds multi-party negotiation agents (governed).

---

## 🏭 Industry
Real estate / portals & brokerages

---

## 🧩 Capabilities
Matching, Retrieval, Personalization, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, pgvector/OpenSearch, MLS RESO APIs, maps APIs (commute isochrones), OpenAI SDK, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Smart Property Matching System** (Agent, L3): prioritize components that match **agent** orchestration and the **real-estate** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- MLS / listing feeds (license-dependent)
- Maps APIs
- CRM (HubSpot, Salesforce) if broker workflow

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
User profile → agent queries listing index + map tools → ranked shortlist + tour itinerary suggestions → CRM handoff

---

## 🔄 Implementation Steps
SQL filters only → add embeddings → add commute tool → add explanation agent → broker review queue for edge cases

---

## 📊 Evaluation
CTR on matches, tour-to-offer rate, fair housing QA pass rate, user complaints, latency p95

---

## ⚠️ Challenges & Failure Cases
Steering on protected classes; wrong school boundaries; stale listings; hallucinated amenities; expensive map API loops—policy filters, source tags, TTLs, rate limits, schema validation

---

## 🏭 Production Considerations
Fair Housing training for prompts, audit of blocked queries, MLS display rules, consent for location data, ADA for UI

---

## 🚀 Possible Extensions
Saved searches with alerts, co-buyer preference merge with conflict UI

---

## 🔁 Evolution Path
Filters → vectors → agent explain → optional negotiation copilots

---

## 🎓 What You Learn
Fair housing aware matching, geospatial constraints, MLS data modeling
