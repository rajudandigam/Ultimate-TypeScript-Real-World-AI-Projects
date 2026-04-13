System Type: Agent  
Complexity: Level 3  
Industry: Security / Abuse  
Capabilities: Analysis, Automation  

# Automated Phishing Takedown Agent

## 🧠 Overview
Assists **trust & safety / security operations** by **clustering suspicious URLs and emails**, **corroborating** with **reputation feeds and sandboxed fetch metadata**, and **drafting takedown packages** (registrar, host, brand protection portals)—**distinct** from **`AI Phishing Detection System`** (classification at mailbox edge): this project focuses on **post-detection response automation** with **legal-process-aware** templates and **human approval** before outbound abuse mail.

---

## 🎯 Problem
Phishing domains propagate faster than manual abuse tickets; inconsistent evidence bundles get rejected by registrars; teams duplicate work across shifts.

---

## 💡 Why This Matters
- **Pain it removes:** Time-to-takedown and attacker dwell time on lookalike domains.
- **Who benefits:** Enterprise security, banks, and large consumer brands.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **tool calls** to WHOIS/RDAP, DNS history, screenshot sandboxes, and **ticketing APIs**; **workflow** enforces SLA and **dual control** on sends.

---

## ⚙️ Complexity Level
**Target:** Level 3 — integrations, evidence discipline, and policy.

---

## 🏭 Industry
Cyber abuse response

---

## 🧩 Capabilities
Analysis, Automation, Retrieval, Observability, Decision making

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK tools, VirusTotal/URLScan (licensed), RDAP clients, Playwright in disposable VMs, Postgres case store, Jira/ServiceNow, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Automated Phishing Takedown Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **security-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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
Ingest IOC → **Takedown Agent** gathers evidence bundle → risk score → human queue → approved → send templated abuse reports → poll status webhooks → escalate registrar chain

---

## 🔄 Implementation Steps
1. Internal lookalike domain watchlists only  
2. Add safe browsing + CT log correlation  
3. Brand logo hash matching with legal-approved thresholds  
4. Multi-language abuse templates by jurisdiction  
5. Metrics on median takedown hours by registrar  

---

## 📊 Evaluation
Median time-to-suspend domain, false positive takedown rate (legal review), evidence rejection rate by providers, analyst time saved

---

## ⚠️ Failure Scenarios
**Legitimate parked domain** collateral; **PII in phishing kit screenshots**—redaction pipeline, conservative auto-send tiers, legal sign-off for bulk actions, never DDoS or hack back

---

## 🤖 Agent breakdown
- **Correlator tools:** cluster URLs by TLS cert, AS, HTML hash.  
- **Evidence packer agent:** assembles PDF/JSON per provider spec.  
- **Drafter agent:** fills templates with **only** tool-sourced facts.  
- **Escalation policy:** rules for when human must edit before send.

---

## 🎓 What You Learn
Abuse ops automation, safe browsing at scale, governance for outbound legal comms
