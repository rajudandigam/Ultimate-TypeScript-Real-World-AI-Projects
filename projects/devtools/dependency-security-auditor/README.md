System Type: Workflow  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Security, Monitoring  

# Dependency Security Auditor

## 🧠 Overview
A **continuous workflow** that ingests **SBOMs** and **lockfile-aware** dependency graphs, queries **OSV/GitHub Advisory** databases (and org private feeds), opens **unified findings**, and drives **remediation tickets** with **reachability** hints from static analysis where available—**not** “run an LLM on CVE text” as the source of truth for severity.

---

## 🎯 Problem
Vulnerabilities arrive faster than teams can triage; noisy scanners create alert fatigue and missed true positives on **transitive** chains.

---

## 💡 Why This Matters
- **Pain it removes:** Manual cross-checking across repos, inconsistent severity language, slow patch verification.
- **Who benefits:** Security + platform engineering in TS/Node monorepos and microservice fleets.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Scheduled scans, diff detection, ticket dedupe, and SLA escalations are **durable workflows**. Optional LLM summarizes **diff context** for humans from structured JSON.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Graph-aware triage + policy packs + multi-repo correlation; L5 adds org-wide risk analytics and automated patch PR bots with heavy guardrails.

---

## 🏭 Industry
Example:
- DevTools / application security

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal security standards linked to findings
- Planning — bounded (remediation waves)
- Reasoning — optional LLM explanations grounded in advisory JSON
- Automation — ticket creation, PR bots (optional)
- Decision making — bounded (priority scoring from composite signals)
- Observability — **in scope**
- Personalization — per-service criticality tags
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** workers
- **pnpm/npm** metadata parsers, **OSV** API client
- **Postgres** for findings state machine
- **Temporal**/**Inngest** for schedules and escalations
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Dependency Security Auditor** (Workflow, L3): prioritize components that match **workflow** orchestration and the **devtools** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- GitHub / GitLab / Azure DevOps REST APIs
- CI provider APIs (GitHub Actions, CircleCI)
- Package registry APIs where relevant

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
Describe the main components:

- **Input (UI / API / CLI):** CI upload of CycloneDX, webhook on default branch merges.
- **LLM layer:** Optional summarizer for engineer comments only.
- **Tools / APIs:** OSV, GitHub Dependabot alerts API, internal package registry metadata.
- **Memory (if any):** Historical suppression decisions with expiry and owners.
- **Output:** Tracker issues, dashboards, Slack digests.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single-repo `pnpm audit` JSON ingest + ticket per CVE.

### Step 2: Add AI layer
- LLM writes human summary referencing only tool-provided fields.

### Step 3: Add tools
- Multi-repo correlation; reachability via `import` graph analysis.

### Step 4: Add memory or context
- Track accepted risk with time-bounded suppressions requiring approvals.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent proposes patch PRs using sandboxed `pnpm patch`—human merge only.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** True positive rate on curated exploit fixtures; noise ratio per repo.
- **Latency:** Time from advisory publish to org notification (where feeds allow).
- **Cost:** Infra + optional LLM digest $ per finding batch.
- **User satisfaction:** Mean time to remediate criticals; developer NPS on alerts.
- **Failure rate:** Duplicate tickets, wrong package attribution in workspaces, missed lockfile variants.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong fixed version; mitigated by showing official version ranges from DB only.
- **Tool failures:** Advisory DB downtime; cache last-known-good with staleness banners.
- **Latency issues:** Huge monorepos; incremental scans keyed by lockfile hash.
- **Cost spikes:** Full rescans every commit; diff-based scanning default.
- **Incorrect decisions:** Auto-suppress too aggressively; dual approval for permanent suppressions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Finding ids, package coordinates, no leaking internal package names beyond policy? (Usually allowed—tune per org.)
- **Observability:** SLA breach rates, backlog age histograms, scanner version drift.
- **Rate limiting:** Respect OSV/public API quotas; use local mirrors where needed.
- **Retry strategies:** Idempotent ticket creation keys `(repo, vuln_id, path)`.
- **Guardrails and validation:** Policy engine for license/legal blocks separate from CVE severity.
- **Security considerations:** Harden worker tokens; isolate PR bots; prevent script injection via malicious package metadata in UI.

---

## 🚀 Possible Extensions

- **Add UI:** Exploitability matrix with runtime telemetry overlays (EPSS).
- **Convert to SaaS:** Org-wide SBOM hub with federated policies.
- **Add multi-agent collaboration:** Code vs infra remediation owners with routing.
- **Add real-time capabilities:** Webhook on new advisory for critical packages only.
- **Integrate with external systems:** Snyk, Wiz, AWS Inspector, ServiceNow.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **deterministic finding identity** before autonomous patching.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **SBOM** lifecycle in TypeScript repos
  - **Policy-as-code** for suppressions
  - **Workflow-driven** security operations
  - **System design thinking** for scalable AppSec signal
