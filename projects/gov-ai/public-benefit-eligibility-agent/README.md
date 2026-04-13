System Type: Agent  
Complexity: Level 2  
Industry: Public Sector  
Capabilities: Reasoning, Compliance  

# Public Benefit Eligibility Agent

## 🧠 Overview
Helps residents **navigate benefits** (SNAP, Medicaid, LIHEAP-style programs—**jurisdiction-specific**) by turning **plain-language situations** into **structured screening answers**, **document checklists**, and **application step guides**—**policy engine** holds rules; the agent **never** auto-approves benefits; all outcomes are **“likely eligible / unclear / likely not”** with **official source links**.

---

## 🎯 Problem
Forms are confusing; call centers are overloaded; misinformation spreads on social media; people abandon applications mid-way.

---

## 💡 Why This Matters
- **Pain it removes:** Access friction and error-driven denials from missing documents.
- **Who benefits:** State/county portals, nonprofits, and community navigators.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over a **versioned rules DSL** compiled from **published eligibility manuals**; LLM only maps user stories to **enum answers** the engine evaluates.

---

## ⚙️ Complexity Level
**Target:** Level 2 — mostly rules + guided UX with bounded LLM use.

---

## 🏭 Industry
Government / civic tech

---

## 🧩 Capabilities
Reasoning, Compliance, Personalization, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres rules packs per county version, OpenAI SDK structured outputs, contentful/CMS for official links, audit log store, OpenTelemetry, WCAG AA UI

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Public Benefit Eligibility Agent** (Agent, L2): prioritize components that match **agent** orchestration and the **gov-ai** integration surface.

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
Intake wizard → normalized answers → **rules engine** decision → **Eligibility Agent** explains in plain language + next steps → handoff to official application deep links

---

## 🔄 Implementation Steps
1. Single program pilot (language-fixed)  
2. Multi-program bundle with cross-effects (income counted once)  
3. Document OCR assist with human confirm  
4. Navigator co-browse mode (session token)  
5. Analytics for drop-off steps without storing raw PII longer than needed  

---

## 📊 Evaluation
Application completion lift vs control, incorrect guidance rate (human audit sample), average time-to-ready-to-apply, support ticket reduction

---

## ⚠️ Challenges & Failure Cases
**Rule drift** when policies change mid-year; **edge cases** (self-employment income); multilingual nuance—versioned rules with publish dates, “we cannot determine” path, human escalation queue, never fabricate program names

---

## 🏭 Production Considerations
Section 508, privacy minimization, consent logging, bias reviews across demographics, partnership with legal for every jurisdiction pack

---

## 🚀 Possible Extensions
SMS reminder flows for renewal windows (opt-in)

---

## 🤖 Agent breakdown
- **Intake parser:** maps free text to structured enums with confidence; low confidence asks clarifying questions.  
- **Rules executor:** deterministic evaluation only.  
- **Explainer agent:** reads engine output JSON + official URLs to produce user-facing steps.

---

## 🎓 What You Learn
Rules+LLM hybrid for high-stakes civic UX, auditability, equitable access patterns
