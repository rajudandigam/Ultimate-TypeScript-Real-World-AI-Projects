System Type: Agent  
Complexity: Level 3  
Industry: Agriculture  
Capabilities: Multimodal, Retrieval  

# Crop Disease Diagnostic Agent

## 🧠 Overview
Analyzes **leaf/canopy images** plus **optional GPS, crop type, and weather context** to suggest **disease hypotheses** with **severity bands** and **IPM-aligned treatment options**—**always** framed as **decision support**: final treatment follows **label laws**, **local extension guidance**, and **agronomist sign-off** where required.

---

## 🎯 Problem
Farmers misidentify stress (drought vs fungus); generic vision apps lack regional pest pressure; late treatment wastes chemistry and residue budget.

---

## 💡 Why This Matters
- **Pain it removes:** Delayed scouting cycles and over/under-application of inputs.
- **Who benefits:** Agronomists, cooperative advisors, and precision ag platforms.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **vision embedding + RAG** over **curated extension bulletins** (licensed); toxicology checks via **structured product DB tools**.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal + compliance-heavy outputs.

---

## 🏭 Industry
Agriculture / crop protection

---

## 🧩 Capabilities
Multimodal, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, ONNX/mobile vision models, OpenAI vision for second opinion (gated), Postgres cases, vector DB for bulletins, S3 images with TTL, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Crop Disease Diagnostic Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **agri-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- MQTT / device telemetry brokers
- Time-series or historian APIs
- Weather or grid data feeds where relevant

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
Upload image → preprocess (resize, EXIF strip) → **Diagnostic Agent** → hypothesis JSON + similar past cases → human agronomist queue for high-stakes crops

---

## 🔄 Implementation Steps
1. Top-5 disease classifier per crop taxonomy  
2. Add symptom Q&A follow-up for disambiguation  
3. Link to labeled chem DB where API exists  
4. Field A/B on advisor acceptance  
5. Offline mode with smaller on-device model  

---

## 📊 Evaluation
Top-1/top-3 accuracy vs lab labels, time-to-advisor-review, chemical recommendation compliance rate, user-reported outcome feedback loop

---

## ⚠️ Challenges & Failure Cases
**Sun glare false lesions**; **nutrient deficiency vs disease** confusion; hallucinated product names—confidence thresholds, “unknown” class, cite bulletin IDs only, block off-label text generation

---

## 🏭 Production Considerations
EPA/FIFRA-sensitive UX, image PII (faces in field), data residency, model cards per region, adversarial uploads

---

## 🚀 Possible Extensions
Drone ortho stitch → patch-level heatmaps fed into same agent

---

## 🤖 Agent breakdown
- **Vision encoder tool:** returns embedding + saliency map token budget.  
- **RAG retriever:** pulls regional extension chunks with mandatory metadata (year, region).  
- **Synthesis agent:** ranks hypotheses, lists non-chemical interventions first, attaches uncertainty language.

---

## 🎓 What You Learn
Regulated ag AI, multimodal+RAG fusion, human-in-loop field workflows
