System Type: Workflow  
Complexity: Level 4  
Industry: Earth observation / Geo intelligence  
Capabilities: Multimodal, Detection  

# Satellite Change Detection Workflow

## 🧠 Overview
A **production EO change-detection pipeline** that aligns **multitemporal satellite stacks** (optical and/or SAR), computes **spectral/structural change metrics**, classifies **change type candidates** (construction, harvest, disturbance), and raises **alerts with geospatial footprints**—targets **insurance, forestry compliance, urban planning, and supply-chain site monitoring** with **human QC** lanes.

---

## 🎯 Problem
Manual image comparison does not scale; naive differencing flags clouds and seasonality as “change”; stakeholders need explainable polygons.

---

## 💡 Why This Matters
- **Pain it removes:** Late awareness of encroachment, illegal clearing, or competitor facility expansion.
- **Who benefits:** Geospatial analysts, ESG field teams, and defense-adjacent monitoring vendors.

---

## 🏗️ System Type
**Chosen:** **Workflow** — preprocess → coregister → index/shape metrics → threshold → vectorize → review; **LLM optional** for **analyst captions** from structured change JSON only.

---

## ⚙️ Complexity Level
**Target:** Level 4 — big rasters, cloud masking, and ops discipline.

---

## 🏭 Industry
Remote sensing / intelligence products

---

## 🧩 Capabilities
Multimodal, Detection, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, GDAL/rasterio workers (Python), STAC catalogs, Sentinel/Landsat/Planet APIs (licensed), PostGIS, COG on S3, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Satellite Change Detection Workflow** (Workflow, L4): prioritize components that match **workflow** orchestration and the **geo-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

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
AOI subscription → **fetch workflow** (STAC items) → **preprocess** (cloud mask, BRDF normalize) → **align** → **change metrics** → **segment** → **classify** (model) → **alert workflow** → dashboard + webhook

---

## 🔄 Implementation Steps
1. Pairwise optical diff with strict cloud mask  
2. Add SAR coherence for persistent monitoring  
3. Parcel/lease boundary overlays for compliance  
4. Confidence calibration with field labels  
5. Export GeoJSON + PDF evidence packs  

---

## 📊 Evaluation
IoU vs human polygons, false alert rate per AOI km², median pipeline hours, API $ per km² monitored

---

## ⚠️ Failure Scenarios
**Misregistration** causes ghost change; **seasonal crop rotation** false positives; **license restrictions** on redistribution—coregistration QC, phenology-aware models, export redaction per provider ToS

---

## 🤖 / workflow breakdown
- **Ingest workflow:** STAC query, checksum, tile cache.  
- **Preprocess worker pool:** radiometry, cloud/snow masks.  
- **Change workflow:** CVA/SAR coherence + optional deep change detector.  
- **Vectorization:** polygon simplification + minimum mapping unit.  
- **Optional caption agent:** consumes metrics + class labels; never invents coordinates.

---

## 🎓 What You Learn
STAC-scale raster ops, geospatial ML deployment, evidence-grade EO products
