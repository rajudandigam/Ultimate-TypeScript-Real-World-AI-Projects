System Type: Workflow  
Complexity: Level 2  
Industry: Media  
Capabilities: Multimodal  

# Automated Subtitle Generation System

## 🧠 Overview
**Workflow** ingests media, runs **ASR** with **language detection**, outputs **SRT/VTT/WebVTT** with **confidence-based QC lanes**, optional **human edit** step, and **burn-in** renditions for legacy players—supports **forced narrative** styles per **Netflix/YouTube** timing rules; **PII/slur** filters on captions where required.

---

## 🎯 Problem
Manual captioning is slow; auto-captions are often wrong for names, accents, and technical jargon.

---

## 💡 Why This Matters
Accessibility (ADA/WCAG), SEO for video, and global distribution need reliable subtitles.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). LLM optional for **glossary biasing** and **post-edit** with constraints.

---

## ⚙️ Complexity Level
**Target:** Level 2.

---

## 🏭 Industry
Streaming / education / corporate video

---

## 🧩 Capabilities
Multimodal, Automation, Monitoring, Observability

---

## 🛠️ Suggested TypeScript Stack
FFmpeg, Whisper or vendor ASR, Node.js workers, glossary store (Postgres), OpenAI optional for constrained post-edit, S3, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Automated Subtitle Generation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **media** integration surface.

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
Media URL → extract audio → ASR → formatters (SRT/VTT) → QC rules → human queue if low confidence → deliver to CMS/CDN

---

## 🔄 Implementation Steps
Raw ASR → custom vocabulary injection → speaker diarization for multi-speaker → style guides per brand → auto-publish with confidence thresholds

---

## 📊 Evaluation
WER by domain, compliance audit pass rate, viewer complaint rate, processing cost per minute

---

## ⚠️ Challenges & Failure Cases
Hallucinated words in low SNR; max line length violations; desync after edits; storing sensitive spoken PII—confidence gating, max CPS limits, forced align pass, redaction lists

---

## 🏭 Production Considerations
GPU autoscaling, DRM-aware pipelines, retention, localization workflow with translation memory

---

## 🚀 Possible Extensions
Same pipeline for live captions with ultra-low latency ASR tier

---

## 🔁 Evolution Path
Batch ASR → QC workflows → glossary-aware → live streaming branch

---

## 🎓 What You Learn
Caption standards, media job orchestration, accessibility engineering
