System Type: Workflow  
Complexity: Level 3  
Industry: Creator / Media  
Capabilities: Multimodal, Extraction  

# Podcast to Social Snippet Generator

## 🧠 Overview
**Workflow-first** pipeline: transcribe episodes, **detect highlight windows** (laughter spikes, applause, quotable lines via NLP + optional vision on waveform), **reframe** for vertical video specs, **burn captions**, and enqueue **render jobs**—distinct from **`Podcast Insight Extraction Agent`** (chapters/show notes): this system targets **short-form distribution** with **brand-safe zones** and **rights checks**.

---

## 🎯 Problem
Clipping for TikTok/Reels/Shorts is manual; wrong aspect ratios and missing captions tank reach; music rights trip automated exports.

---

## 💡 Why This Matters
- **Pain it removes:** Repurposing cost for indie podcasters and network social teams.
- **Who benefits:** Creators, agencies, and podcast networks.

---

## 🏗️ System Type
**Chosen:** **Workflow** — ASR, scoring, ffmpeg renders, and QC gates are **deterministic**; optional LLM for **title variants** only.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal pipeline + render farm integration.

---

## 🏭 Industry
Creator economy

---

## 🧩 Capabilities
Multimodal, Extraction, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Whisper-class ASR, FFmpeg workers, OpenAI optional for hook copy, S3, BullMQ, OpenTelemetry, YouTube/TikTok upload APIs (policy-compliant)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Podcast to Social Snippet Generator** (Workflow, L3): prioritize components that match **workflow** orchestration and the **creator-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SendGrid / SES / customer.io for outbound
- Meta / Google Ads APIs (only if ads are in-scope)
- YouTube / podcast hosting APIs when media ingestion applies

### Open Source Building Blocks
- **n8n** — fast integration fabric when the blueprint is connector-heavy and ops wants visibility.
- **Temporal + TypeScript SDK** — when you need durable timers, saga compensation, and strict replay semantics.
- **BullMQ + Redis** — lighter option for queue-backed steps without full Temporal yet.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node worker + Postgres + Redis + Temporal (or n8n if integrations dominate) — auditable steps and retries match workflow-first designs.
- **Lightweight:** Hono + BullMQ + Postgres — ship a weekend MVP with cron + queue, migrate to Temporal when sleeps and compensations hurt.
- **Production-heavy:** Temporal Cloud + OTel + separate ingest workers + multi-region Postgres (read replicas) when SLAs and replay volume demand it.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
RSS or file drop → transcribe → highlight scorer → **snippet spec JSON** → human QC lane → GPU render → publish queue → analytics feedback loop

---

## 🔄 Implementation Steps
1. Auto 45s clips from transcript keyword hits  
2. Face-safe crop heuristics + title safe areas  
3. Template packs per show brand  
4. A/B title testing metadata only  
5. Rights-aware music stem separation or mute policy  

---

## 📊 Evaluation
Human accept rate of clips, watch-through on published shorts, render cost per minute, copyright strike count (target 0)

---

## ⚠️ Challenges & Failure Cases
**False highlights** on tangents; **burned-in guest PII**; platform-specific caption safe zones—human QC for sensitive shows, redaction pass, max clip count per episode

---

## 🏭 Production Considerations
DRM on masters, tenant isolation, GPU autoscaling, storage lifecycle, quota per network

---

## 🚀 Possible Extensions
Auto-generated thread of quote cards for X from same highlight JSON

---

## 🤖 Agent breakdown
Workflow steps (not autonomous multi-agent): **ASR worker** → **scorer** (rules + small model) → **copy variant LLM** (optional) → **renderer** → **publisher**; humans gate brand-sensitive shows.

---

## 🎓 What You Learn
Media pipelines at scale, QC for short-form, rights-aware automation
