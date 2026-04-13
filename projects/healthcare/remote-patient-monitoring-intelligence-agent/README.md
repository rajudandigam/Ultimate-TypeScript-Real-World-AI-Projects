System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Monitoring  

# Remote Patient Monitoring Intelligence Agent

## 🧠 Overview
An **RPM copilot** that ingests **device vitals streams** (HR, SpO₂, BP, weight, glucometry), detects **trend anomalies** vs personalized baselines, and triages **alerts to care teams** with **contextual summaries** and **suggested next steps**—aligned with **clinical escalation protocols** and **HIPAA** telemetry handling.

---

## 🎯 Problem
Raw thresholds create false alarms; nurses cannot watch dashboards 24/7; patients churn when alerted too often.

---

## 💡 Why This Matters
- **Pain it removes:** Alert fatigue and delayed escalation for true deteriorations.
- **Who benefits:** Chronic care programs, cardiology HF clinics, and post-acute monitoring vendors.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **time-series tools** and **EHR snapshot** tools; durable ingestion is **workflow**-driven.

---

## ⚙️ Complexity Level
**Target:** Level 3 — streaming signals, personalization, and safety rails.

---

## 🏭 Industry
Healthcare / digital health

---

## 🧩 Capabilities
Monitoring, Prediction, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, MQTT/HTTP ingest, TimescaleDB, FHIR Observation writer, OpenAI SDK for bounded narratives, Redis windows, Grafana, OpenTelemetry, Twilio/secure messaging for escalations

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Remote Patient Monitoring Intelligence Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

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
Devices → gateway → normalization → rolling features → **RPM Agent** → severity + rationale → escalation workflow → EHR documentation assist (human finalized)

---

## 🔄 Implementation Steps
1. Threshold + rate-of-change rules baseline  
2. Per-patient baseline learning with guardrails  
3. Integrate care plan and meds for context  
4. Closed-loop tracking of interventions  
5. Edge offline buffering on mobile gateways  

---

## 📊 Evaluation
Sensitivity/specificity vs clinician labels on episodes, alert burden per patient-week, time-to-nurse review, patient-reported nuisance scores

---

## ⚠️ Challenges & Failure Cases
**Sensor dropout** mimicking bradycardia; **motion artifact**; demographic bias in baselines—multi-signal agreement rules, device quality flags, human-in-loop for high-stakes cohorts, explicit uncertainty in summaries

---

## 🏭 Production Considerations
Encrypted transport, device identity, SOC2 for vendor ops, state licensure for triage nurses, audit logs for every automated page

---

## 🚀 Possible Extensions
RPM + symptom NLP from patient free-text with strict moderation

---

## 🔁 Evolution Path
Static thresholds → personalized baselines → agent-triage with escalation playbooks → outcomes-linked retraining loops

---

## 🎓 What You Learn
Streaming health data, safe alerting UX, regulated monitoring pipelines
