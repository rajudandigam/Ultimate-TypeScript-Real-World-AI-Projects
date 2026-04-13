System Type: Workflow → Agent  
Complexity: Level 5  
Industry: AI Infra  
Capabilities: Validation, Safety  

# AI Guardrails & Safety Engine

## 🧠 Overview
A **policy enforcement plane** that inspects **inputs and outputs** around LLM calls using **deterministic rules** (schemas, regex, allowlists) plus an **optional classifier agent** for nuanced cases—returning **structured decisions** (`allow`, `mask`, `block`, `escalate`) with audit metadata for compliance and on-call review.

---

## 🎯 Problem
Prompt injection, PII leakage, toxic outputs, and tool misuse are not “model problems” alone—they are **systems problems** requiring consistent enforcement at gateways, not scattered `if` statements in each service.

---

## 💡 Why This Matters
- **Pain it removes:** Inconsistent safety behavior across teams, slow incident response, and inability to prove what policy was active when an output shipped.
- **Who benefits:** Security engineering, trust & safety, and regulated product teams shipping customer-facing AI.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow → Agent

**Workflows** run fast deterministic stages and orchestrate **versioned policy packs**. An **agent** can assist with **contextual judgments** only when rules abstain—and must never bypass hard blocks recorded in audit logs.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Safety infra needs HA, multi-tenant isolation, policy CI, and provable evaluation against adversarial suites.

---

## 🏭 Industry
Example:
- AI Infra (policy engines, gateway security, enterprise AI governance)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (retrieve policy clauses, legal snippets)
- Planning — light (ordered policy stages)
- Reasoning — bounded (classifier explanations with confidence)
- Automation — **in scope** (auto-escalate to human queue)
- Decision making — **in scope** (policy outcomes)
- Observability — **in scope**
- Personalization — optional (per-tenant policy packs)
- Multimodal — optional (image safety checks)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** sidecar or reverse proxy middleware
- **OPA** / **CEL** for deterministic policy evaluation
- **OpenAI SDK** for classifier models with structured outputs
- **Postgres** (policy versions, audit decisions)
- **Redis** (rate limits, token buckets)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Guardrails & Safety Engine** (Workflow → Agent, L5): prioritize components that match **hybrid** orchestration and the **ai-infra** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- OpenAI / Anthropic / multi-vendor model APIs
- Kubernetes or Docker APIs if self-hosted
- OIDC provider for tool consent

### Open Source Building Blocks
- **Temporal or n8n** for the deterministic spine; **OpenAI Agents SDK** or **LangChain.js** for LLM steps inside activities.
- **Vercel AI SDK** if a Next.js surface streams partial results to users.
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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Intercept requests/responses via SDK middleware or edge proxy; admin UI for policy publishing.
- **LLM layer:** Optional secondary classifier for “edge” categories with calibrated thresholds.
- **Tools / APIs:** Ticketing for escalations, secret scanners, URL safety lookups (allowlisted).
- **Memory (if any):** Retrieval of policy text for explainability—not for bypassing blocks.
- **Output:** Decision object attached to trace + optional redacted payload to downstream model.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- JSON schema validation + blocklist + max tokens.

### Step 2: Add AI layer
- Lightweight classifier for toxicity/PII categories with human-reviewed thresholds.

### Step 3: Add tools
- Add escalation tool to create tickets with evidence bundle (hashed content).

### Step 4: Add memory or context
- Versioned policy RAG for “why blocked” explanations to internal users only.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional separate **prompt-injection specialist** model behind same orchestrator—still single decision object.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall on red-team sets; false block rate on production traffic samples.
- **Latency:** Added p95 latency on guarded paths (microseconds for rules, milliseconds for classifiers).
- **Cost:** Classifier spend per 1k requests at target block rates.
- **User satisfaction:** Support tickets about false positives; time to policy update rollout.
- **Failure rate:** Policy evaluation errors, bypass attempts, desync between edge and core policies.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Classifier flips randomly; mitigated by ensembles, temperature 0, and shadow mode before enforcement.
- **Tool failures:** External URL scanners down; mitigated by fail-closed vs fail-open policy per risk tier (explicitly configured).
- **Latency issues:** Chained checks; mitigated by parallelizing independent stages and caching policy compilation.
- **Cost spikes:** Running huge models on every keystroke; mitigated by tiered checks (cheap first).
- **Incorrect decisions:** Blocks legitimate medical content; mitigated by domain-specific allowlists and appeals workflow.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log policy version + decision + rule id; avoid storing raw secrets; support legal discovery exports.
- **Observability:** Dashboards for block reasons, latency overhead, shadow vs enforce divergence.
- **Rate limiting:** Per user/IP/tenant to prevent adversarial load and cost attacks.
- **Retry strategies:** Idempotent decision logging; safe retries on classifier timeouts with fallback path.
- **Guardrails and validation:** Policy packs signed in CI; cannotary without review; schema validation for policy AST.
- **Security considerations:** Tamper-proof audit chain; separate admin plane auth; pen-test adversarial prompts regularly.

---

## 🚀 Possible Extensions

- **Add UI:** Policy diff viewer and simulation against historical traffic (redacted).
- **Convert to SaaS:** Hosted policy marketplace with vetted packs per industry.
- **Add multi-agent collaboration:** Rare—prefer deterministic core with optional specialist classifiers.
- **Add real-time capabilities:** Streaming partial output scanning with windowed buffers.
- **Integrate with external systems:** SIEM, GRC tools, identity providers for admin roles.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Expand model-based judgment only where rules cannot scale and eval proves net benefit.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Policy-as-code** for LLM gateways
  - **Shadow mode** and safe rollout patterns
  - **Adversarial evaluation** as continuous practice
  - **System design thinking** for defense-in-depth around models
