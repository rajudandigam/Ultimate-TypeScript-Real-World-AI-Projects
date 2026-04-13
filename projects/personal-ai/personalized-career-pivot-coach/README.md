System Type: Agent  
Complexity: Level 3  
Industry: Personal / Career  
Capabilities: Personalization, Planning  

# Personalized Career Pivot Coach

## 🧠 Overview
Helps knowledge workers **map skills → adjacent roles**, build a **credible narrative**, and produce a **learning roadmap** (courses, certs, portfolio projects) using **resume + public profile imports** (user-authorized) and **labor market signals** (ONS/BLS or licensed APIs)—**not** a replacement for coaches or recruiters; **no guaranteed outcomes**; flags **sensitive bias** risks in suggestions.

---

## 🎯 Problem
Pivoting feels opaque; people undersell transferable skills; generic advice ignores local market and visa constraints.

---

## 💡 Why This Matters
- **Pain it removes:** Paralysis and mismatched upskilling spend.
- **Who benefits:** Mid-career tech workers, returning parents, and laid-off cohorts with agency consent flows.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **structured tools** (skills taxonomy lookup, job posting retrieval, course catalog APIs) and **memory** scoped to user vault with export/delete.

---

## ⚙️ Complexity Level
**Target:** Level 3 — personalization + retrieval + guardrails.

---

## 🏭 Industry
Career / edtech-adjacent

---

## 🧩 Capabilities
Personalization, Planning, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres + pgvector for user doc chunks, OpenAI SDK, Lightcast/Adzuna APIs (examples), OAuth for LinkedIn import (scoped), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Personalized Career Pivot Coach** (Agent, L3): prioritize components that match **agent** orchestration and the **personal-ai** integration surface.

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
Consent + data import → **normalize skills graph** → **Coach Agent** proposes role adjacency matrix → user picks target → generates 90-day plan with milestones → calendar export + progress nudges

---

## 🔄 Implementation Steps
1. Resume parse to structured skills only  
2. Market demand overlay by metro  
3. Visa-sensitive wording mode (informational, not legal advice)  
4. Portfolio project generator tied to GitHub template repos  
5. Weekly retro prompts to update plan  

---

## 📊 Evaluation
User-reported interview rate lift (self), plan completion %, harmful suggestion reports (target ~0), churn reasons taxonomy

---

## ⚠️ Failure Scenarios
**Stale postings** drive bad targets; **stereotyped role suggestions**; overpromising salary—date-stamped market data, fairness review set, show confidence intervals, “consult a licensed advisor” for immigration/legal

---

## 🤖 Agent breakdown
- **Profiler tool:** extracts skills/projects with provenance spans.  
- **Market tool:** pulls posting stats with API timestamps.  
- **Coach agent:** composes adjacency paths and learning steps with citations to postings/docs.  
- **Guardrail pass:** blocks discriminatory language and checks for disallowed sensitive inference.

---

## 🎓 What You Learn
Consent-first personal data products, labor market grounding, responsible coaching UX
