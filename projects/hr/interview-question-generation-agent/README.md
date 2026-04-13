System Type: Agent  
Complexity: Level 2  
Industry: HR  
Capabilities: Generation  

# Interview Question Generation Agent

## 🧠 Overview
Generates **role-specific interview guides** (behavioral, system design, coding rubrics where applicable) from **JD text**, **level ladder**, and **competency model** pulled via tools—outputs are **structured question banks** with **follow-ups** and **scoring hints**, for **human interviewer** use only; **no** automated hiring decisions.

---

## 🎯 Problem
Interview panels reinvent questions inconsistently; weak rubrics let bias and “vibes” dominate signal.

---

## 💡 Why This Matters
- **Pain it removes:** Prep time for hiring managers, uneven bar across loops, and thin documentation for calibration.
- **Who benefits:** Recruiting coordinators and engineering managers running structured interviews.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

`fetch_jd`, `fetch_competency_matrix`, `draft_questions`, `lint_bias` (policy rules + optional classifier).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Template + retrieval + validation; L3+ adds org memory of past calibrated packs and multilingual variants.

---

## 🏭 Industry
Example:
- HR / interviewing & talent assessment

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal interviewing guides, legal constraints
- Planning — bounded (panel agenda)
- Reasoning — bounded (follow-up suggestions)
- Automation — export to Notion/Google Docs/ATS
- Decision making — n/a for hire outcomes
- Observability — **in scope**
- Personalization — level band (L4 vs L6) and team culture notes
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**, **OpenAI SDK** structured outputs
- **Greenhouse/Lever** APIs for JD fetch
- **Postgres** for pack versions
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Interview Question Generation Agent** (Agent, L2): prioritize components that match **agent** orchestration and the **hr** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Workday / BambooHR / Greenhouse-style APIs (pick what your org uses)
- Slack / Teams
- Google Drive / SharePoint for doc sources

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

- **Input (UI / API / CLI):** Req id, role family, interview loop type (phone/onsite).
- **LLM layer:** Agent emits `InterviewSection[]` JSON with rubric anchors.
- **Tools / APIs:** ATS, internal leveling docs (ACL), code exercise policy flags.
- **Memory (if any):** Prior approved packs as exemplars (permissioned).
- **Output:** Printable pack + ATS attachment metadata.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static question bank per role family.

### Step 2: Add AI layer
- LLM adapts static bank to JD keywords with human review.

### Step 3: Add tools
- Pull live JD and level expectations; enforce banned/disallowed question classes.

### Step 4: Add memory or context
- Store calibration notes post-interview for next loop (aggregated, non-PII).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional DEI reviewer pass as separate tool-only policy engine.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Panel agreement scores vs ad-hoc baselines; post-mortem quality on hires (long horizon).
- **Latency:** Time to generate pack for one req.
- **Cost:** Tokens per pack; near-zero infra otherwise.
- **User satisfaction:** Interviewer NPS; reduced “what should I ask?” pings.
- **Failure rate:** Illegal/insensitive questions, leaked confidential JD details.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Company-specific policies invented; only cite retrieved internal docs.
- **Tool failures:** Missing JD version; block generation until resolved.
- **Latency issues:** Long JD + long competency matrix; summarize server-side with citations.
- **Cost spikes:** Regeneration loops; cap retries.
- **Incorrect decisions:** Questions that screen out protected groups; bias lint + legal review list.

---

## 🏭 Production Considerations

- **Logging and tracing:** Pack version ids; avoid logging candidate names with model calls.
- **Observability:** Lint failure taxonomy, export counts, edit distance after human tweaks.
- **Rate limiting:** Per recruiter; detect scraping of internal ladders.
- **Retry strategies:** Idempotent doc exports.
- **Guardrails and validation:** Block medical/disability/inappropriate probes; region-specific labor law hints (non-legal-advice disclaimers).
- **Security considerations:** ACL on internal leveling docs, encryption, watermark drafts as non-final.

---

## 🚀 Possible Extensions

- **Add UI:** Live panel timer + note capture (separate product surface).
- **Convert to SaaS:** Interview intelligence for SMB ATS customers.
- **Add multi-agent collaboration:** Role-play “mock candidate” for interviewer training only.
- **Add real-time capabilities:** Suggested follow-ups based on live transcript (privacy heavy).
- **Integrate with external systems:** Metaview, BrightHire (where licensed).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep **human ownership** of hiring bar explicit in UX and contracts.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Structured interviewing** at scale
  - **Policy linting** for sensitive HR content
  - **ATS + knowledge base** integration
  - **System design thinking** for ethical hiring tools
