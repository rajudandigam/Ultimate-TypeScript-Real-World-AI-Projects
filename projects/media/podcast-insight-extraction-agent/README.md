System Type: Agent  
Complexity: Level 2  
Industry: Media  
Capabilities: Extraction  

# Podcast Insight Extraction Agent

## 🧠 Overview
Turns **episode audio** into **chapters, summaries, key quotes, topics, and guest mentions** with **timestamps**—uses **ASR + diarization** tools; LLM structures output **only** from transcript text; **disclaimer** for proper nouns and **fact-sensitive** claims; human publisher reviews before RSS update.

---

## 🎯 Problem
Show notes lag episodes; SEO and clip discovery suffer; manual transcription is expensive.

---

## 💡 Why This Matters
Improves discoverability and repurposing without misrepresenting speakers.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using).

---

## ⚙️ Complexity Level
**Target:** Level 2.

---

## 🏭 Industry
Podcasting / audio media

---

## 🧩 Capabilities
Extraction, Generation, Multimodal (speech), Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, ASR vendor or Whisper, OpenAI SDK structured outputs, Postgres episode store, RSS/hosting APIs, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Podcast Insight Extraction Agent** (Agent, L2): prioritize components that match **agent** orchestration and the **media** integration surface.

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
RSS poll or upload → transcribe → agent emits chapter JSON → editor UI → publish to CMS/host

---

## 🔄 Implementation Steps
ASR only → add summarizer → add quote extraction with char offsets → sponsor read detection optional → auto-post with human default-off

---

## 📊 Evaluation
WER proxy, human edit distance on summaries, chapter usefulness ratings, time saved per episode

---

## ⚠️ Challenges & Failure Cases
Misattributed speakers; hallucinated quotes; copyrighted lyrics in music beds; PII in live Q&A—diarization confidence thresholds, blocklist, redaction, human QC for sensitive shows

---

## 🏭 Production Considerations
Retention policy for audio, consent for voice cloning adjacent features (off by default), ADA transcripts

---

## 🚀 Possible Extensions
Clip suggestions for Shorts/Reels with safe crop metadata

---

## 🔁 Evolution Path
Manual notes → ASR → structured extraction → optional auto-publish with guardrails

---

## 🎓 What You Learn
Audio NLP pipelines, timestamp-grounded summarization, publishing workflows
