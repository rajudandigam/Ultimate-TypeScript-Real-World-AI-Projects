System Type: Agent  
Complexity: Level 4  
Industry: Healthcare  
Capabilities: Computer Vision, Detection  

# Medical Imaging Analysis Assistant

## 🧠 Overview
**Research and clinical-decision-support blueprint** (not an **FDA-cleared** device by default): DICOM ingestion, **CV model** inference for candidate findings, and an **agent** that explains outputs in **structured reports** for radiologist review—**human read** remains authoritative; model outputs are **draft annotations** only.

---

## 🎯 Problem
Workload and variability; teams want **assistive** triage and reporting, not unaccountable automation.

---

## 🏗️ System Type
**Chosen:** Agent orchestrating **deterministic CV** tools (`run_model_v3`, `fetch_prior_study`).

---

## ⚙️ Complexity Level
**Target:** Level 4. DICOM, PACS integration, QA, clinical workflows.

---

## 🏭 Industry
Healthcare / radiology assist (governed deployment).

---

## 🧩 Capabilities
Computer Vision, Detection, Retrieval (priors), Observability.

---

## 🛠️ Suggested TypeScript Stack
**Orthanc**/DICOMweb, **OHIF** or custom viewer, **Python** inference service, **Node.js** BFF, **Postgres** metadata, audit.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Medical Imaging Analysis Assistant** (Agent, L4): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

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
PACS → anonymized study fetch → inference → structured findings JSON → agent narrative → PACS MWL/annotation export per site policy.

---

## 🔄 Implementation Steps
Viewer-only overlays → model v1 with QA sampling → workflow for sign-off → optional regulatory path for SaMD if pursued.

---

## 📊 Evaluation
Sensitivity/specificity vs labeled set, inter-reader agreement, latency per series.

---

## ⚠️ Challenges & Failure Cases
**False negatives**—never silent auto-dismiss. **Model drift**—continuous QA. **De-identification** leaks—strict pipelines. **Hallucinated** lesions—bind narrative to bbox tool JSON only.

---

## 🏭 Production Considerations
HIPAA, audit trails, device classification legal path, incident response, versioned models, GPU capacity planning.

---

## 🚀 Possible Extensions
Multi-series fusion, triage prioritization lists, federated learning (research).

---

## 🔁 Evolution Path
Triage only → full draft report → supervised autonomy only with regulatory clearance.

---

## 🎓 What You Learn
DICOM/PACS, ML ops in clinical settings, safety culture for diagnostic assist.
