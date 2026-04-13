System Type: Multi-Agent  
Complexity: Level 4  
Industry: Security  
Capabilities: Monitoring  

# Threat Intelligence Aggregation Platform

## 🧠 Overview
A **multi-agent control plane** that **ingests heterogeneous threat feeds** (STIX bundles, vendor APIs, internal detections), runs **specialist agents** for **deduplication, correlation, and graph linking**, and produces **SOC-ready timelines** with **confidence-scored edges**—complements single-agent “ask intel” systems by focusing on **always-on fusion** and **playbook triggers**.

*Catalog note:* Distinct from **`AI Threat Intelligence Aggregator`** (agent-centric Q&A). This blueprint emphasizes **multi-agent pipelines** for feed normalization + correlation + automated routing.

---

## 🎯 Problem
Feeds disagree on the same campaign; IOC churn is high; analysts need **machine-speed correlation** without losing **provenance**.

---

## 💡 Why This Matters
- **Pain it removes:** Manual pivot tables across tools and missed lateral links during active incidents.
- **Who benefits:** SOC/CTI teams operating 24/7 fusion centers.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — separate agents for **ingest validation**, **entity resolution**, **hypothesis linking**, and **customer-facing briefing** with a **supervisor** enforcing policy.

---

## ⚙️ Complexity Level
**Target:** Level 4 — orchestrated specialists with shared graph state and guardrails.

---

## 🏭 Industry
Cybersecurity / threat intelligence

---

## 🧩 Capabilities
Monitoring, Retrieval, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Neo4j or graph layer on Postgres, OpenSearch, OpenAI Agents SDK or Mastra, Kafka/PubSub, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Threat Intelligence Aggregation Platform** (Multi-Agent, L4): prioritize components that match **multi** orchestration and the **security** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SIEM ingestion (Splunk HEC, Elastic, Datadog Logs)
- IdP / SCIM (Okta, Entra) for RBAC
- Cloud audit / CSP APIs for posture

### Open Source Building Blocks
- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.
- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node service + OpenAI Agents SDK + Postgres state store + Redis queue for async specialist work + OTel traces — fits handoff-heavy blueprints.
- **Lightweight:** Single Node process + in-memory queue for demos; still use Zod schemas and one Postgres schema for trip/issue graph state.
- **Production-heavy:** LangGraph for explicit graph control + dedicated worker pool per agent family + strict RBAC on tools + eval harness in CI.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Connectors → raw landing zone → **Normalizer Agent** → **Entity-Resolution Agent** → graph writer → **Correlation Agent** → alert topics → optional **Briefing Agent** (grounded)

---

## 🔄 Implementation Steps
1. Two feeds + manual review UI  
2. STIX 2.1 canonical model  
3. Graph + time-window correlation rules  
4. Automated case creation with evidence links  
5. Drift monitors + red-team prompts for agent overreach  

---

## 📊 Evaluation
Graph precision/recall on labeled incidents, mean correlation latency, analyst edit distance on auto cases, false escalation rate

---

## ⚠️ Challenges & Failure Cases
**False fusion** across unrelated actors; poisoned feeds; PII in raw intel; agent “storytelling” without edges—immutable provenance fields, human gate for outbound automations, signed connector configs

---

## 🏭 Production Considerations
Data residency, classified handling tiers, retention policies, kill switch for auto-actions, cost caps on LLM steps

---

## 🚀 Possible Extensions
Purple-team simulation hooks that replay historical incidents for regression testing

---

## 🔁 Evolution Path
ETL-only → rule correlation → specialist agents → supervised multi-agent with graded autonomy

---

## 🎓 What You Learn
Intel graph modeling, multi-agent supervision, evidence-first automation in security
