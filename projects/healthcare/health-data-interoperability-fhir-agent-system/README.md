System Type: Agent  
Complexity: Level 4  
Industry: Healthcare  
Capabilities: Integration, Retrieval, Reasoning  

# Health Data Interoperability (FHIR Agent System)

## 🧠 Overview
An **integration copilot** that helps teams map **legacy feeds** (CSV, HL7 v2, proprietary JSON) to **FHIR R4** using **deterministic transforms** for the common path and a **tool-using agent** for **exception mapping**—always **validated** against profiles (for example **US Core** where applicable) and **terminology** services. **Human data stewards** approve mapping patches; the agent never silently writes clinical content to production stores.

---

## 🎯 Problem
Interop programs stall on messy sources, one-off scripts, and tribal knowledge. Engineers need **speed** without **losing governance**, **lineage**, and **regression safety** across implementation guide releases.

---

## 💡 Why This Matters
- **Pain it removes:** Slow mapping cycles, repeated foot-guns on references and code systems, and “works on my laptop” ETL that breaks in production.
- **Who benefits:** Health information exchanges, hospital integration teams, and vendors onboarding new sites.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The creative work is **localized exception resolution** with heavy **tool grounding** (`validate_bundle`, `expand_valueset`, `diff_against_fixture`). Bulk transforms remain **workflow/ETL** owned.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. This is **orchestration-heavy** interoperability (IG constraints, terminology, batch + incremental), bordering L5 when you add multi-tenant self-serve mapping studios and continuous certification testing.

---

## 🏭 Industry
Example:
- Healthcare / HIE / EHR integration

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal mapping docs + IG PDF/HTML snippets (permissioned)
- Planning — bounded (patch plans for steward review)
- Reasoning — bounded (explain why a field maps; cite IG sections)
- Automation — ETL workflows around the agent
- Decision making — bounded (propose patches; humans approve)
- Observability — **in scope**
- Personalization — per-tenant alias dictionaries
- Multimodal — optional diagram screenshots for legacy schema docs

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** integration services
- **HAPI FHIR** or cloud FHIR stores; **SMART on FHIR** for auth between systems
- **Postgres** for mapping lineage, test fixtures, and quarantines
- **OpenAI SDK** (or equivalent) with strict JSON schema outputs
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Health Data Interoperability (FHIR Agent System)** (Agent, L4): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

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

- **Input (UI / API / CLI):** Steward workbench, connector admin, CI test runner.
- **LLM layer:** Agent proposes `MappingPatch` objects against a constrained schema.
- **Tools / APIs:** FHIR `$validate`, terminology server, fixture diff, source record fetcher.
- **Memory (if any):** Versioned mapping packs per tenant; retrieval over internal docs.
- **Output:** Validated bundles, quarantine rows, audit trail of approvals.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Hard-coded transforms for one source + `$validate` in CI on golden patients.

### Step 2: Add AI layer
- Agent explains validation errors to stewards with citations to IG text snippets.

### Step 3: Add tools
- Wire terminology lookups, patient/id reconciliation helpers, and fixture regression tests.

### Step 4: Add memory or context
- Retrieval over internal playbooks; store approved mapping patterns per site.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional second agent as **test generator** only—still subordinate to CI gates (true multi-agent is optional).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Field-level error rate vs steward-labeled validation sets; reduction in `$validate` failures over time.
- **Latency:** Time to clear exception queue per 1k rows after agent assist.
- **Cost:** LLM $ per approved mapping change; cache hit rate on repeated errors.
- **User satisfaction:** Steward edit distance on proposals; qualitative trust surveys.
- **Failure rate:** Wrong Patient/Encounter references; silent data loss in transforms.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented extensions or profiles; mitigated by **server-side validation** and **reject-on-unknown**.
- **Tool failures:** Terminology server timeouts; mitigated with cached code system slices and degraded read-only mode.
- **Latency issues:** Huge batches; mitigated by **row-level quarantine** rather than blocking entire loads.
- **Cost spikes:** Re-embedding entire IG libraries; mitigated by chunking, caching, and pinned doc versions.
- **Incorrect decisions:** Merging two patients; mitigated with **deterministic matching rules first**, agent only suggests on ties with human approval.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log mapping version ids and validation outcomes; minimize raw PHI in prompts—prefer pseudonymized fixtures.
- **Observability:** Validator error taxonomy trends, connector lag, steward throughput.
- **Rate limiting:** Per-tenant LLM budgets; concurrency caps on validation calls.
- **Retry strategies:** Idempotent writes to FHIR with `If-Match` / conditional creates where supported.
- **Guardrails and validation:** **No auto-apply** to production without signed approval artifact; immutable audit of who approved what patch.
- **Security considerations:** HIPAA, OAuth between systems, least-privilege FHIR scopes, secrets rotation, regional residency.

---

## 🚀 Possible Extensions

- **Add UI:** Visual graph of resource references with broken-link highlighting.
- **Convert to SaaS:** Multi-tenant mapping studio with package marketplace.
- **Add multi-agent collaboration:** Separate **test synthesis** agent with isolated sandbox FHIR server.
- **Add real-time capabilities:** Incremental subscriptions (e.g., `Subscription` resources) where supported.
- **Integrate with external systems:** Bulk `$import`, cloud data lakes, CDM exports.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **validation-first** pipelines before expanding agent autonomy.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **FHIR profiling** and validation discipline
  - **Human-in-the-loop** for clinical data mapping
  - **Safe tool use** under strict schemas
  - **System design thinking** for regulated interoperability
