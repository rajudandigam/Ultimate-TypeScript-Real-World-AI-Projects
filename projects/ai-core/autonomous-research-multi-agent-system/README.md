System Type: Multi-Agent  
Complexity: Level 4  
Industry: AI Core / Research  
Capabilities: Research  

# Autonomous Research Multi-Agent System

## 🧠 Overview
A **multi-agent research stack** that **plans investigations**, **retrieves sources** (web + internal corpora when connected), **critiques evidence**, and **synthesizes** a **cited brief**—with **budgets**, **stop rules**, and **adversarial critique** to reduce **confident fiction**.

---

## 🎯 Problem
Single-shot LLM “research” hallucinates citations; long tasks lose thread; unsafe browsing risks.

---

## 💡 Why This Matters
- **Pain it removes:** Manual tab hoarding for competitive intel, due diligence, and technical deep dives.
- **Who benefits:** Analysts, PMs, and engineers exploring unfamiliar domains quickly.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Planner**, **Retriever**, **Analyst**, **Critic**, optional **Fact-checker** with a supervisor.

---

## ⚙️ Complexity Level
**Target:** Level 4 — orchestration, tool governance, and evaluation harnesses.

---

## 🏭 Industry
Research / knowledge work

---

## 🧩 Capabilities
Research, Retrieval, Reasoning, Planning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI Agents SDK, Tavily/Bing APIs (with keys), internal RAG connector, Playwright fetcher in sandbox, Postgres trace store, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Autonomous Research Multi-Agent System** (Multi-Agent, L4): prioritize components that match **multi** orchestration and the **ai-core** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- OpenAI / Anthropic / multi-vendor model APIs
- Kubernetes or Docker APIs if self-hosted
- OIDC provider for tool consent

### Open Source Building Blocks
- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.
- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
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
Question → plan graph → parallel retrieve → note cards → critic pass → synthesis with citations → export (Markdown/PDF)

---

## 🔄 Implementation Steps
1. Fixed pipeline (no autonomy)  
2. Add planner with max depth  
3. Critic agent blocks unsupported claims  
4. Human review queue for high-risk topics  
5. Continuous eval on golden questions  

---

## 📊 Evaluation
Citation support rate (human verified), nugget recall vs gold summaries, average tool calls, unsafe URL fetch rate (should be ~0)

---

## ⚠️ Challenges & Failure Cases
**Circular citations**; paywalled content mis-summarized; **prompt injection** in web pages—fetch sandboxes, allowlisted domains, snapshot hashing, critic must flag “no source”

---

## 🏭 Production Considerations
Copyright respect, robots.txt compliance, PII redaction, per-tenant web access policies, cost ceilings

---

## 🚀 Possible Extensions
Team workspaces where humans pin “trusted sources” per project

---

## 🔁 Evolution Path
Manual prompts → tool-using researcher → supervised multi-agent → governed research API product

---

## 🎓 What You Learn
Evidence-based synthesis, multi-agent debate patterns, web automation safety
