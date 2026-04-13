System Type: Agent  
Complexity: Level 4  
Industry: DevTools  
Capabilities: Optimization, Reasoning  

# Infrastructure Cost Optimization Agent

## 🧠 Overview
A **FinOps copilot** that reads **tagged billing exports**, **K8s/node utilization**, and **reserved instance coverage** via tools, then proposes **concrete savings actions** (rightsizing, idle teardown, storage tiering) with **estimated $ impact** and **risk notes**—**no** auto-apply to production without **policy-gated** automation. Outputs are **grounded in query results**, not guessed from model weights.

---

## 🎯 Problem
Cloud bills grow faster than engineering attention; dashboards alone do not create **prioritized, safe** change lists across accounts and teams.

---

## 💡 Why This Matters
- **Pain it removes:** Surprise invoices, orphaned resources, and endless spreadsheet FinOps meetings.
- **Who benefits:** Platform engineering, SRE, and finance partners in multi-account AWS/GCP/Azure orgs.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The agent loops on **SQL/API facts** (`cost_query`, `list_unattached_volumes`, `get_autoscaling_stats`) and emits **structured recommendations** validated by **policy** (no deleting stateful disks without tags + approvals).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Cross-signal reasoning (utilization + billing + architecture metadata) with strong governance; L5 adds org-wide automated execution with simulation environments and chargeback integrations.

---

## 🏭 Industry
Example:
- DevTools / cloud platform / FinOps

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal standards (“allowed instance families”, tagging policy)
- Planning — bounded (quarterly savings roadmap)
- Reasoning — bounded (tradeoffs: latency vs cost)
- Automation — optional Terraform plan bots (human apply)
- Decision making — bounded (ranked recommendations)
- Observability — **in scope**
- Personalization — per-team budgets and guardrails
- Multimodal — optional architecture diagrams as context (careful—PII)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** BFF
- **OpenAI SDK** with tool calling
- **AWS SDK**/**GCP SDK** read-only roles, **BigQuery**/**Athena** for CUR queries
- **Postgres** for recommendation state + approvals
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Infrastructure Cost Optimization Agent** (Agent, L4): prioritize components that match **agent** orchestration and the **devtools** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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

- **Input (UI / API / CLI):** FinOps chat, scheduled “savings digest” jobs, PR-style review UI.
- **LLM layer:** Agent composes `Recommendation[]` JSON with evidence ids.
- **Tools / APIs:** Billing exports, resource inventory, metrics TSDB, CMDB tags.
- **Memory (if any):** Prior accepted recommendations to avoid thrash; org policy embeddings.
- **Output:** Ranked actions + links to queries + optional Terraform plan attachments.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static report of top cost SKUs from CSV export.

### Step 2: Add AI layer
- LLM narrates CSV tables (already aggregated, no raw secrets).

### Step 3: Add tools
- Live queries for utilization vs billed CPU/memory; detect idle namespaces.

### Step 4: Add memory or context
- Track executed changes and measured realized savings for feedback.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist agents for **data warehouse** vs **k8s** with orchestrated merge.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Realized savings vs predicted on executed items; false idle detection rate.
- **Latency:** Time to produce digest for large orgs (async acceptable).
- **Cost:** LLM + warehouse query cost vs savings found.
- **User satisfaction:** Team adoption of recommendations; finance trust scores.
- **Failure rate:** Suggesting changes that break SLOs, wrong account scoping, leaking secrets in prompts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented instance types; mitigated by tool-only SKU lists in outputs.
- **Tool failures:** IAM gaps cause partial views; explicit incompleteness banners.
- **Latency issues:** Massive CUR tables; preaggregate daily rollups.
- **Cost spikes:** Runaway broad inventory scans; partition by OU with budgets.
- **Incorrect decisions:** Rightsizing latency-sensitive workloads; require SLO tool checks before recommend.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log query fingerprints, not raw rows with customer data.
- **Observability:** Savings pipeline funnel, override reasons, policy violation attempts.
- **Rate limiting:** Per-tenant API quotas; backoff on cloud control plane errors.
- **Retry strategies:** Safe read retries; never auto-delete—Terraform plans only with approvals.
- **Guardrails and validation:** Deny destructive tools in v1; enforce tag-based eligibility.
- **Security considerations:** Least-privilege FinOps roles, SSO, audit of who saw which accounts.

---

## 🚀 Possible Extensions

- **Add UI:** What-if simulator for reserved coverage changes.
- **Convert to SaaS:** Multi-cloud FinOps workspace.
- **Add multi-agent collaboration:** Reliability reviewer vetoes risky cuts.
- **Add real-time capabilities:** Anomaly alerts on daily spend spikes.
- **Integrate with external systems:** Infracost, Kubecost, CloudHealth, Databricks usage.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **measurement + safety** before any closed-loop infrastructure changes.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **FinOps data modeling** in TypeScript services
  - **Evidence-first** optimization copilots
  - **IAM and least privilege** at scale
  - **System design thinking** for cost vs reliability tradeoffs
