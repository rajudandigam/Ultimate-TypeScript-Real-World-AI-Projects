System Type: Agent  
Complexity: Level 4  
Industry: Security / Cybersecurity  
Capabilities: Classification, Detection  

# AI Phishing Detection System

## 🧠 Overview
A **tool-using security agent** that classifies inbound email and messaging artifacts as **phishing, suspicious, or benign** using **structured signals** (headers, URLs, attachments metadata, reputation lookups) plus **bounded LLM reasoning** for novel social-engineering patterns—designed so analysts can **audit** every high-risk decision and so false positives do not silently block legitimate business mail without policy tiers.

---

## 🎯 Problem
Rule-only filters miss spear-phishing and fast-rotating infrastructure; naive LLM-only classifiers **hallucinate** evidence and leak sensitive mail content into logs. Production needs **deterministic gates**, **explainable features**, and **human-in-the-loop** escalation paths.

---

## 💡 Why This Matters
- **Pain it removes:** Analyst overload, delayed triage, and inconsistent user reporting quality.
- **Who benefits:** Security operations teams, MSPs, and email security vendors integrating into existing MTA/SIEM stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Phishing triage is a **single analyst-style agent** with tools for sandbox metadata, URL expansion, and threat intel lookups. Multi-agent is optional only if separating **content extraction** from **verdict synthesis** for isolation.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You are combining **classification**, **external intel tools**, and **SOC workflows** without claiming full malware sandbox parity unless extended to L5.

---

## 🏭 Industry
Example:
- Security / Cybersecurity (email security, messaging abuse, insider risk adjacent)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (internal playbooks, past similar cases—redacted)
- Planning — bounded (triage steps)
- Reasoning — bounded (attack narrative vs benign explanation)
- Automation — optional (auto-quarantine with policy)
- Decision making — bounded (risk score + recommended action)
- Observability — **in scope**
- Personalization — optional (per-tenant tuning)
- Multimodal — optional (image QR in PDFs—careful pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (ingestion workers)
- **Postgres** (cases, verdicts, audit)
- **Redis** (rate limits, URL cache)
- **OpenAI SDK** / **Vercel AI SDK** (structured outputs)
- **VirusTotal / URLhaus** style APIs (as tools)
- **OpenTelemetry** (PII-safe spans)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Phishing Detection System** (Agent, L4): prioritize components that match **agent** orchestration and the **security** integration surface.

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
Describe the main components:

- **Input (UI / API / CLI):** Webhook from MTA, analyst UI, user “report phishing” button.
- **LLM layer:** Agent produces `Verdict` + `evidence[]` referencing only tool-returned facts.
- **Tools / APIs:** Header parser, URL expander, domain age, attachment hash reputation, sandbox job submit (optional).
- **Memory (if any):** Tenant-specific allow/deny patterns and historical false-positive corrections.
- **Output:** SIEM event, ticket, or quarantine action per policy tier.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic rules + blocklists; no LLM in path.

### Step 2: Add AI layer
- LLM summarizes analyst-facing narrative from structured JSON only.

### Step 3: Add tools
- Add URL expansion and intel APIs behind caching and quotas.

### Step 4: Add memory or context
- Retrieve similar closed cases (hashed identifiers, no raw body by default).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional extractor microservice for MIME parsing vs verdict agent.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall on labeled corpora; cost per true positive at fixed FPR.
- **Latency:** p95 triage time vs SLA for near-real-time delivery paths.
- **Cost:** Tokens + API calls per message at scale.
- **User satisfaction:** Analyst time saved; disputed quarantine rate.
- **Failure rate:** Missed phish in holdout sets; automation-induced outages.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Cited nonexistent URLs; mitigated by evidence schema tied to tool outputs only.
- **Tool failures:** Intel API downtime; mitigated by degraded mode + explicit uncertainty flags.
- **Latency issues:** Sandbox latency; mitigated by async path and partial scoring.
- **Cost spikes:** Re-analyzing bulk threads; mitigated by dedupe keys and sampling policies.
- **Incorrect decisions:** Blocking payroll or MFA emails; mitigated by tiered automation, appeals workflow, and domain allowlists with governance.

---

## 🏭 Production Considerations

- **Logging and tracing:** Never log raw credentials or full message bodies by default; field-level redaction.
- **Observability:** Verdict distribution drift, tool error rates, analyst override rates.
- **Rate limiting:** Per tenant and per sender hash; protect intel API keys.
- **Retry strategies:** Idempotent case creation; safe replays for webhooks.
- **Guardrails and validation:** Schema validation on verdicts; block autonomous domain-wide blocks without role approval.
- **Security considerations:** Secrets management, tenant isolation, tamper-evident audit trail, legal hold workflows.

---

## 🚀 Possible Extensions

- **Add UI:** Analyst cockpit with diffable evidence and one-click false-positive feedback.
- **Convert to SaaS:** Multi-tenant scoring with per-tenant model routing.
- **Add multi-agent collaboration:** Separate malware specialist agent with stricter tool scopes.
- **Add real-time capabilities:** Streaming verdicts for live chat abuse.
- **Integrate with external systems:** SOAR playbooks, Jira/ServiceNow, cloud email APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **shadow mode** (observe-only) before any auto-quarantine.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Evidence-first** LLM outputs in security
  - **PII minimization** in detection pipelines
  - **Policy tiers** for automation vs human review
  - **System design thinking** for mail-scale ingestion
