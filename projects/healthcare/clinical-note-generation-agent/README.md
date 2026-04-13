System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Generation, Speech  

# Clinical Note Generation Agent

## 🧠 Overview
A **documentation assistant** that turns **clinician-consented audio** (or text dictation) into **structured draft notes** (SOAP-style sections) using **encounter templates** and **EHR-grounded facts** from scoped reads—**never auto-signing** legal charts. Low-confidence spans are flagged; **providers review and sign** in the EHR or companion UI under your compliance program.

---

## 🎯 Problem
Documentation load burns clinician time; naive speech-to-text + generic LLMs **hallucinate meds, doses, and plans** and create medico-legal and billing risk.

---

## 💡 Why This Matters
- **Pain it removes:** Late-night charting, inconsistent structure, and missing required elements for billing/quality measures.
- **Who benefits:** Ambulatory clinics, telehealth groups, and scribe operations that can enforce **human final sign-off**.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One thread composes the note using tools like `fetch_active_meds` (read-only), `apply_template`, `flag_uncertain_span`. Audio capture and retention are owned by a **workflow** with explicit consent timestamps.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Adds **ASR + structuring** with EHR tools and session context; L4+ splits specialized agents (coding assistant, patient-education writer) with stricter boundaries.

---

## 🏭 Industry
Example:
- Healthcare / ambulatory / telehealth documentation

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional clinic style guide and section macros
- Planning — bounded (choose template sections)
- Reasoning — bounded (map transcript claims to tool-backed facts)
- Automation — optional push draft to EHR in “unsigned” state
- Decision making — bounded (what to ask provider to confirm)
- Observability — **in scope**
- Personalization — per-specialty templates
- Multimodal — **speech** input path

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js** or **Electron**-adjacent web for mic capture (org policy dependent)
- **WebRTC** streaming to **ASR** (medical vendor or self-hosted where feasible)
- **Node.js + TypeScript** BFF with SMART on FHIR reads
- **OpenAI SDK** (structured outputs) or equivalent
- **KMS**, **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Clinical Note Generation Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

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

- **Input (UI / API / CLI):** Mic with explicit start/stop; locale and specialty metadata.
- **LLM layer:** Agent drafts from transcript chunks + tool JSON facts.
- **Tools / APIs:** FHIR MedicationStatement, Problems, Vitals (scoped); template library.
- **Memory (if any):** Short encounter session buffer; configurable audio retention (prefer none/minimal).
- **Output:** Draft note JSON/Markdown + confidence flags + diff view for provider edits.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Paste transcript → template-filled note with no EHR reads (demo).

### Step 2: Add AI layer
- LLM structures sections but must quote transcript spans for each clinical sentence.

### Step 3: Add tools
- SMART read tools for meds/problems; block writes from the agent.

### Step 4: Add memory or context
- Carry forward corrections within session to reduce repeated errors.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional coding/billing agent **only** after note signed and under separate compliance review.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Clinician edit distance; medication/dose error rate on labeled encounters.
- **Latency:** Time from end of recording to first draft; streaming partials if used.
- **Cost:** ASR + LLM $ per encounter minute.
- **User satisfaction:** NASA-TLX / time-motion studies in pilots.
- **Failure rate:** Unsupported clinical claims, wrong patient context, ASR confusions (sound-alikes).

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented allergies or doses; mitigated by **tool-required** med list and **span grounding** rules.
- **Tool failures:** FHIR downtime; mitigated with explicit “facts unavailable—do not infer” behavior.
- **Latency issues:** Long monologues; mitigated with chunked ASR + incremental drafting.
- **Cost spikes:** Always-on streaming; mitigated with session caps and org budgets.
- **Incorrect decisions:** Signing without reading; mitigated with UX friction, mandatory uncertainty flags, and training—not model-only fixes.

---

## 🏭 Production Considerations

- **Logging and tracing:** Redact PHI in traces; store draft hashes for audit, not raw audio if policy forbids.
- **Observability:** ASR WER proxies, tool success rates, time-to-sign, abandonment rate.
- **Rate limiting:** Per clinician and per site; detect anomalous scraping of EHR via tools.
- **Retry strategies:** Idempotent draft versions; conflict resolution if EHR state changed mid-session.
- **Guardrails and validation:** BAA, consent capture, break-glass policies, malpractice workflows, pediatric safeguards, language access.
- **Security considerations:** Encryption, session TTL, device posture checks for BYOD, tenant isolation.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side waveform + transcript highlight linked to note sentences.
- **Convert to SaaS:** Multi-tenant template marketplace with clinical governance.
- **Add multi-agent collaboration:** Separate coding suggestion agent with **post-sign** gating only.
- **Add real-time capabilities:** Live partial drafting during visit with “pause learning” controls.
- **Integrate with external systems:** Epic Haiku/Canto patterns via vendor SDKs where licensed.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **non-inferential** drafting with tools before expanding to richer workflows.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **ASR + LLM** safety patterns in clinical settings
  - **SMART on FHIR** read scoping
  - **Human-in-the-loop** chart completion
  - **System design thinking** for documentation copilots
