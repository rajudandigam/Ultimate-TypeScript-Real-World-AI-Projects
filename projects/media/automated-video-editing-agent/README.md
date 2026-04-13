System Type: Agent  
Complexity: Level 3  
Industry: Media  
Capabilities: Multimodal  

# Automated Video Editing Agent

## 🧠 Overview
Creates **short-form clips** from long videos using **scene detection**, **transcript alignment**, and **brand safe zones**—agent proposes **cut lists + captions + b-roll suggestions**; **render** happens in **FFmpeg/transcode workers** with **human preview** before publish. **Rights**: only process **licensed** source material.

---

## 🎯 Problem
Clipping for social is labor-intensive; inconsistent branding and unsafe frames slip through.

---

## 💡 Why This Matters
Scales repurposing webinars, podcasts-on-video, and sports highlights workflows.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over **media processing toolchain**.

---

## ⚙️ Complexity Level
**Target:** Level 3 (multimodal + tooling + render pipeline).

---

## 🏭 Industry
Media / creator ops

---

## 🧩 Capabilities
Multimodal, Generation, Planning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, FFmpeg WASM/workers, Whisper-class ASR, shot detection CV service, OpenAI SDK (vision for thumbnails), S3, queue (SQS/BullMQ), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Automated Video Editing Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **media** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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
Upload → transcode proxy → ASR + scene boundaries → agent proposes EDL JSON → preview UI → render farm → CDN publish

---

## 🔄 Implementation Steps
Manual EDL templates → ASR-only rough cuts → vision-based highlight scoring → brand template overlays → A/B export presets per platform

---

## 📊 Evaluation
Human accept rate of clips, watch-time retention on published clips, render cost per minute, rights incident count (0 target)

---

## ⚠️ Challenges & Failure Cases
Wrong scene boundaries; audio drift; copyrighted music in source; hallucinated on-screen text—QC waveforms, mute policy, content ID checks, template-only text overlays

---

## 🏭 Production Considerations
GPU autoscaling, DRM on source, PII blur for audience shots, storage lifecycle, quota per tenant

---

## 🚀 Possible Extensions
Auto chapters for YouTube, multi-language caption burn-in variants

---

## 🔁 Evolution Path
Templates → ASR/scene tools → agent-guided EDL → assisted full edits (human final cut)

---

## 🎓 What You Learn
Video pipelines, EDL as data, multimodal agent guardrails for media
