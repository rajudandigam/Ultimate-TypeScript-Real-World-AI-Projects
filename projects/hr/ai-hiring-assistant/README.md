System Type: Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Reasoning, Matching  

# AI Hiring Assistant

## 🧠 Overview
A **decision-support agent** for recruiting that helps hiring teams **structure evidence** from resumes and structured applications, **compare** candidates against a published rubric, and **draft** interview questions—without autonomous hiring decisions or hidden scoring that cannot be audited.

---

## 🎯 Problem
High-volume recruiting creates inconsistent screening, interviewer drift, and feedback that lives in private notes. At the same time, “AI hiring” products that output opaque scores create **legal and ethical risk** if they cannot show **job-related** criteria tied to specific resume excerpts.

---

## 💡 Why This Matters
- **Pain it removes:** Slow first-pass screening, vague interviewer prep, and weak audit trails for why candidates advanced or not.
- **Who benefits:** Recruiting coordinators, hiring managers in structured interview programs, and SMBs without dedicated HR tech stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Screening is best served by **one accountable agent** with tools to fetch job descriptions, rubrics, and application payloads, emitting **structured artifacts** (strengths, gaps, suggested questions). Multi-agent adds coordination overhead with little benefit until you separate **compliance review** in regulated environments.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Matching improves when you retrieve **internal definitions** of levels (engineering ladders, competency dictionaries) and prior anonymized calibration notes—implemented carefully with privacy controls.

---

## 🏭 Industry
Example:
- HR (recruiting operations, structured interviewing)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (internal rubrics, role guides—not arbitrary web advice)
- Planning — light (interview plan outlines)
- Reasoning — **in scope**
- Automation — optional (export to ATS fields; human confirm)
- Decision making — **in scope** as **advisory ranking** with explicit uncertainty and bias checks
- Observability — **in scope**
- Personalization — per-role templates
- Multimodal — optional (resume PDF layout parsing)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (hiring manager UI with redaction modes)
- **Node.js + TypeScript** API
- **OpenAI SDK** (structured outputs)
- **Greenhouse / Lever / Ashby** APIs (as available)
- **Postgres** (audit logs, consent records, model versions)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Hiring Assistant** (Agent, L3): prioritize components that match **agent** orchestration and the **hr** integration surface.

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

- **Input (UI / API / CLI):** Job posting id, candidate packet, reviewer identity, jurisdiction/consent flags.
- **LLM layer:** Agent produces rubric-aligned summaries and question banks with citations to resume lines.
- **Tools / APIs:** Fetch role rubric, fetch team interview guide, write notes back to ATS as drafts only.
- **Memory (if any):** Retrieve internal competency docs; avoid storing unnecessary PII in embeddings.
- **Output:** Structured review packet: skills map, risk flags (visa needs, missing must-haves), interview prompts, **no auto-reject** unless explicitly configured as rules-based outside the LLM.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template interview guides per role; no model.

### Step 2: Add AI layer
- Model drafts strengths/gaps with citations only to provided text.

### Step 3: Add tools
- ATS fetch tools; rubric fetch; export draft feedback.

### Step 4: Add memory or context
- Retrieve ladder expectations; store calibration notes with access controls.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional compliance reviewer agent with read-only tools in regulated enterprises.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Alignment with human panel labels on blinded samples; inter-rater agreement improvements.
- **Latency:** Time to first draft packet for typical applications.
- **Cost:** Tokens per candidate at acceptable quality after caching rubrics.
- **User satisfaction:** Hiring manager time saved, candidate experience feedback (if surveyed ethically).
- **Failure rate:** Missing citations, schema failures, ATS tool errors, policy blocks.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented employers or credentials; mitigated by citation requirements and OCR confidence flags.
- **Tool failures:** ATS pagination and rate limits; mitigated by backoff and partial processing states.
- **Latency issues:** Large PDFs; mitigated by chunking and async jobs with notifications.
- **Cost spikes:** Reprocessing all historical candidates; mitigated by incremental updates only on new events.
- **Incorrect decisions:** Discriminatory outcomes; mitigated by **human-in-the-loop**, bias testing, restricted features in sensitive jurisdictions, and legal review of prompts and data fields used.

---

## 🏭 Production Considerations

- **Logging and tracing:** Audit who viewed what candidate data; minimize retention; support deletion requests.
- **Observability:** Monitor tool failures, model refusals, and human override rates.
- **Rate limiting:** Per recruiter and per org to prevent scraping misuse.
- **Retry strategies:** Idempotent ATS writes with draft semantics.
- **Guardrails and validation:** Block protected-attribute inference features; regional policy toggles; explicit consent banners.
- **Security considerations:** Encrypt PII, strict RBAC, SOC2-ready access logs, separate staging tenants with synthetic data.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side rubric scoring with evidence pins.
- **Convert to SaaS:** Multi-tenant with per-org rubric packs.
- **Add multi-agent collaboration:** Compliance reviewer + hiring manager agent with merged output object.
- **Add real-time capabilities:** Live interview note-taking with post-call structured recap.
- **Integrate with external systems:** Background check initiation (human-gated), scheduling tools.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep hiring outcomes human-owned; automate paperwork and prep, not moral judgment.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Structured recruiting artifacts** (rubrics, citations, audit logs)
  - **Safe tool access** to sensitive HR systems
  - **Bias and compliance** thinking as engineering requirements
  - **System design thinking** for high-stakes decision support
