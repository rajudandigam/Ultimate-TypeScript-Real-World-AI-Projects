System Type: Agent  
Complexity: Level 4  
Industry: Security / Insider Risk  
Capabilities: Behavioral analysis, Monitoring  

# Continuous Insider Threat Detection Agent

## 🧠 Overview
An **insider-risk analytics agent** that correlates **identity, access, DLP, endpoint, and business application signals** into **time-bounded risk scores** and **investigation briefs** for SOC/Insider Risk teams—**distinct** from session-only zero trust scoring: this system emphasizes **crown-jewel data paths**, **privilege escalation**, **mass download anomalies**, and **SIEM-native** workflows with **HR/legal governance** hooks.

*Catalog note:* Complements **`Zero Trust Behavioral Authenticator`** (continuous **access** trust for sessions). This project targets **insider threat programs** (UEBA-style) with **case management** and **evidence packaging**, not primary authentication.

---

## 🎯 Problem
Attackers with valid credentials exfiltrate slowly; siloed alerts miss sequences; investigations drown in raw logs without narrative.

---

## 💡 Why This Matters
- **Pain it removes:** Late detection of departing-employee theft and compromised power users.
- **Who benefits:** Insider risk, SOC, and employee relations under policy.

---

## 🏗️ System Type
**Chosen:** **Single Agent** for **analyst copilot** summaries and **query planning**; **streaming scoring** and **rules** remain **deterministic services** feeding the SIEM.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-source correlation, governance, and high-stakes false positive control.

---

## 🏭 Industry
Enterprise security

---

## 🧩 Capabilities
Behavioral analysis, Monitoring, Decision making, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Kafka feature bus, Splunk/Microsoft Sentinel APIs, Okta/Entra ID, DLP exports, Postgres case store, OpenAI SDK (structured briefs only), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Continuous Insider Threat Detection Agent** (Agent, L4): prioritize components that match **agent** orchestration and the **security-ai** integration surface.

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
Normalized events → **feature windows** → **risk scorer** → threshold → **Insider Threat Agent** composes timeline + hypotheses → case in SOAR → human disposition → feedback labels

---

## 🔄 Implementation Steps
1. High-value asset catalog + access baselines  
2. Sequence detectors (download → share → USB) with cooldowns  
3. Offboarding risk flags with HR workflow integration  
4. Privacy-preserving aggregates (no keystroke logging by default)  
5. Red-team insider playbooks quarterly  

---

## 📊 Evaluation
MTTD for simulated insider chains, false positive rate per 1k employees, analyst time-to-triage, case closure quality audits

---

## ⚠️ Failure Scenarios
**Work-from-travel** false positives; **union/legal** sensitivity on “behavior”; **bias against contractors**—jurisdiction-aware policies, human review for HR-visible actions, fairness monitoring, explicit employee notice where required

---

## 🤖 Agent breakdown
- **Feature pipeline (non-LLM):** rolling stats, rare access, mass object reads.  
- **Scoring engine:** ensemble + rule fusion with versioned models.  
- **Investigation agent:** reads **only** aggregated case JSON + SIEM snippets to propose next queries (no PII in model logs beyond policy).  
- **Policy gate:** blocks automated punitive HR actions—recommendations only.

---

## 🎓 What You Learn
UEBA design, SIEM correlation, governance for workplace monitoring
