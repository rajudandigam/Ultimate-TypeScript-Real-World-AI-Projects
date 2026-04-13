System Type: Agent  
Complexity: Level 4  
Industry: Healthcare  
Capabilities: Reasoning  

# Clinical Decision Support System

## 🧠 Overview
A **clinical decision support (CDS) agent** that surfaces **evidence-backed suggestions** (differential considerations, **appropriate orders**, guideline links) from **structured EHR data + approved knowledge bases**—**never** replaces clinician judgment; outputs are **graded recommendations** with **citations**, **contraindication checks**, and **audit trails** for **FDA SaMD / CDS** governance paths where applicable.

---

## 🎯 Problem
Clinicians face information overload; generic search is unsafe; static rule engines miss nuance and go stale.

---

## 💡 Why This Matters
- **Pain it removes:** Delayed recognition of guideline-concordant options and inconsistent documentation of rationale.
- **Who benefits:** Physicians, APPs, and hospital IT implementing responsible CDS at the point of care.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **read-only FHIR/tools** and **non-binding** suggestions; **workflow** handles alerts routing and acknowledgment SLAs.

---

## ⚙️ Complexity Level
**Target:** Level 4 — interoperability, safety layers, and regulatory-aware design.

---

## 🏭 Industry
Healthcare / clinical software

---

## 🧩 Capabilities
Reasoning, Retrieval, Decision making, Observability, Compliance

---

## 🛠️ Suggested TypeScript Stack
Node.js, FHIR R4 client, SMART on FHIR, Postgres, vector index over **licensed** guideline corpora, OpenAI SDK with strict JSON schema, OpenTelemetry, feature flags for rollout by department

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Clinical Decision Support System** (Agent, L4): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

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
EHR hook (CDS Hooks) → patient context pack → **CDS Agent** → suggestion cards → clinician accept/dismiss → log outcomes for quality review

---

## 🔄 Implementation Steps
1. Medication interaction subset with explicit sources  
2. Condition-specific order sets with citations  
3. Lab trend interpretation with uncertainty language  
4. Bias/fairness reviews across demographics (process)  
5. Continuous evaluation vs chart-stimulated recall studies  

---

## 📊 Evaluation
Appropriate test ordering metrics (where measured), alert burden (alerts per 100 encounters), override reasons taxonomy, time-to-action in pilot wards

---

## ⚠️ Challenges & Failure Cases
**Hallucinated citations**; outdated guidelines; **alert fatigue**; missing allergies in chart—hard blocks on uncited claims, versioned KB, sensitivity-specific suppression rules, always show data provenance timestamps

---

## 🏭 Production Considerations
HIPAA logging minimization, break-glass access, uptime SLOs for CDS Hooks, localization, liability disclosures in UI

---

## 🚀 Possible Extensions
Dept-specific “playbooks” maintained by clinical champions with diffable versioning

---

## 🔁 Evolution Path
Static rules → RAG over guidelines → tool-using CDS agent → measured continuous improvement with safety boards

---

## 🎓 What You Learn
CDS Hooks, evidence grounding in medicine, safety-critical AI UX, regulated product thinking
