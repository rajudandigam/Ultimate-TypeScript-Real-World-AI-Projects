System Type: Agent  
Complexity: Level 5  
Industry: Security / Cybersecurity  
Capabilities: Retrieval, Analysis  

# AI Threat Intelligence Aggregator

## 🧠 Overview
A **production-grade ingestion and analysis platform** that **collects** normalized indicators and narrative reports from many feeds (STIX/TAXII, RSS, vendor APIs, paste-style sources where licensed), then uses a **retrieval-heavy agent** to **summarize trends**, **cluster campaigns**, and answer analyst questions with **citations**—built for **provenance**, **deduplication**, and **time-decay** so intel stays trustworthy at scale.

---

## 🎯 Problem
Threat intel is noisy, duplicated, and inconsistently formatted. Analysts waste time reconciling IOCs across sources. LLM summaries without **grounding** become dangerous fiction. You need **ETL discipline** plus **bounded synthesis**.

---

## 💡 Why This Matters
- **Pain it removes:** Fragmented bookmarks, stale IOCs, and weak situational awareness during incidents.
- **Who benefits:** SOC teams, CTI programs, and MSSPs delivering curated briefings to customers.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The “brain” is one **analysis agent** over a **search/index layer** and **SQL metrics**. Multi-agent is optional for **separate enrichment** workers, but the user-facing Q&A should stay unified for coherence.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Multi-tenant ingestion, **compliance** for sensitive sources, **SLAs**, **drift monitoring**, and **cost controls** are first-class.

---

## 🏭 Industry
Example:
- Security / Cybersecurity (CTI platforms, situational awareness)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (grounded briefings)
- Planning — bounded (investigation playbooks)
- Reasoning — bounded (hypothesis vs evidence)
- Automation — optional (auto-tickets, blocklist export with governance)
- Decision making — bounded (prioritize which clusters matter)
- Observability — **in scope**
- Personalization — optional (per-team watchlists)
- Multimodal — optional (screenshots of reports—careful licensing)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Postgres** (canonical IOC graph, lineage)
- **OpenSearch / Elasticsearch** (full-text + vector hybrid)
- **Temporal** / **Inngest** (connectors, retries)
- **OpenAI SDK** (structured analysis)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Threat Intelligence Aggregator** (Agent, L5): prioritize components that match **agent** orchestration and the **security** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SIEM ingestion (Splunk HEC, Elastic, Datadog Logs)
- IdP / SCIM (Okta, Entra) for RBAC
- Cloud audit / CSP APIs for posture

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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Connector configs, analyst search UI, briefing subscriptions.
- **LLM layer:** Agent answers questions by querying index + metrics tools.
- **Tools / APIs:** Search, graph neighborhood, “what changed since T”, export STIX bundles.
- **Memory (if any):** Team preferences and saved investigations (access-controlled).
- **Output:** Briefings with citations, dashboards, webhook alerts for threshold breaches.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single-feed ingest to DB; simple search UI.

### Step 2: Add AI layer
- LLM summarizes one source article with mandatory quotes from text spans.

### Step 3: Add tools
- Add cross-source search, IOC pivot, and timeline builder tools.

### Step 4: Add memory or context
- Store investigation notebooks with entity links and audit trail.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional enrichment workers (geo, ASN) as separate services feeding the index.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Citation precision on held-out Q&A sets; false linkage rate in clustering.
- **Latency:** p95 interactive query time under index load.
- **Cost:** Embedding + LLM cost per million ingested docs at target freshness.
- **User satisfaction:** Analyst NPS, time-to-first useful briefing.
- **Failure rate:** Stale IOCs served after expiration; connector silent failures.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented APT names; mitigated by retrieval-only claims and entity dictionary validation.
- **Tool failures:** Search cluster brownouts; mitigated by partial results banners and cached snapshots.
- **Latency issues:** Huge graph pivots; mitigated by limits, pagination, and precomputed rollups.
- **Cost spikes:** Re-embed everything nightly; mitigated by content hashing and incremental updates.
- **Incorrect decisions:** Auto-blocking based on low-confidence intel; mitigated by human approval for destructive exports.

---

## 🏭 Production Considerations

- **Logging and tracing:** Source attribution in logs; minimize sensitive victim data.
- **Observability:** Connector lag, dedupe ratio, index freshness, hallucination guard triggers.
- **Rate limiting:** Per connector and per analyst session; fair queuing.
- **Retry strategies:** Exponential backoff with jitter; dead-letter misconfigured feeds.
- **Guardrails and validation:** License compliance per source; PII scrubbing on ingest.
- **Security considerations:** Tenant isolation, KMS encryption, RBAC, tamper-evident audit for exports.

---

## 🚀 Possible Extensions

- **Add UI:** Campaign graph explorer with provenance side panel.
- **Convert to SaaS:** Customer-specific watchlists and white-label briefings.
- **Add multi-agent collaboration:** Separate “enrichment” agent pool with no customer data access to prompts.
- **Add real-time capabilities:** Streaming alerts for spike detection on IOC velocity.
- **Integrate with external systems:** SIEM, TIP, SOAR, Slack/Teams.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **grounding** and **lineage** before expanding automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Intel normalization** (STIX-ish modeling)
  - **Hybrid retrieval** for security text
  - **Provenance-first** summarization
  - **System design thinking** for connector-heavy data platforms
