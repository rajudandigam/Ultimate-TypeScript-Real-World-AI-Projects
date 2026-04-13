System Type: Agent  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Reasoning, Automation, Retrieval  

# AI Code Review Agent

## 🧠 Overview
A **single-agent** service that ingests pull-request context (diffs, metadata, CI signals), calls repository tools and optional retrieval over internal code, and returns **structured review findings**: severity-tagged issues, concrete suggestions, and test gaps—without pretending to be a merge authority.

---

## 🎯 Problem
Human reviewers repeat the same classes of checks: style drift, missing tests, risky refactors, API contract breaks, and dependency changes with blast radius. At the same time, naive “LLM comments on diff” approaches produce noisy, ungrounded feedback that teams learn to ignore.

---

## 💡 Why This Matters
- **Pain it removes:** Slow review cycles for mechanical checks, inconsistent standards across teams, and review fatigue on large diffs.
- **Who benefits:** Platform teams standardizing review policy, maintainers of high-throughput repos, and internal developer portals that want **actionable** commentary tied to evidence.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One agent with a **bounded tool registry** (fetch file, symbol search, CI artifacts) matches the problem: sequential reasoning over a coherent PR state with a single accountable output bundle. Multi-agent splits rarely help unless you isolate unrelated analyzers (security vs performance) behind a merge layer you already need for other reasons.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. The jump from “comment on diff” to “useful” comes from **retrieval** (module docs, prior incidents, style guides) plus **deterministic validators** that the model cannot bypass.

---

## 🏭 Industry
Example:
- DevTools (internal engineering systems, Git hosting integrations, CI platforms)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (code, ADRs, runbooks; scoped by repo/branch)
- Planning — light (review checklist decomposition)
- Reasoning — **in scope**
- Automation — **in scope** (posting comments, labels; behind permissions)
- Decision making — bounded (severity, merge recommendation as *advisory*)
- Observability — **required** for production rollout
- Personalization — optional (team-specific rulesets)
- Multimodal — optional (screenshots in PR description)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (webhook worker, queue consumer)
- **OpenAI SDK for TypeScript** or **OpenAI Agents SDK** (structured outputs + tool calls)
- **GitHub REST/GraphQL** (diffs, checks, comments)
- **Octokit** (typed GitHub client)
- **Postgres** (review runs, embeddings metadata, audit)
- **pgvector** or hosted vector index (optional RAG)
- **OpenTelemetry** (trace tool spans per PR)
- **Next.js** (optional internal UI for triage of agent suggestions)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Code Review Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **devtools** integration surface.

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

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Git `pull_request` / `pull_request_synchronize` webhooks; optional manual “re-run review” API.
- **LLM layer:** One agent loop with strict JSON schema for findings; separate “explain” path optional.
- **Tools / APIs:** Read diff hunks, fetch related files, query symbols, read CI logs, query vector store filtered by repo and path allowlists.
- **Memory (if any):** Embeddings over **allowed** corpora (monorepo docs, API specs), never whole-internet code; TTL and ACLs per tenant.
- **Output:** Structured review artifact stored in DB + GitHub review comment or check run with stable IDs for deduplication.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Webhook → fetch diff + file list → static rules (size thresholds, forbidden paths) → template comment.

### Step 2: Add AI layer
- LLM summarizes change intent and proposes risks **with citations** to diff line ranges only.

### Step 3: Add tools
- Implement tools: `get_file`, `list_changed_files`, `get_ci_logs`, `search_repo` (bounded).

### Step 4: Add memory or context
- Index ADRs and READMEs per service; retrieve top-k with metadata filters (path prefix, team).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional: add a second specialized pass (security heuristics) behind the same orchestrator; only promote to multi-agent if evaluation shows isolated failure modes worth separate prompts/policies.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall on a labeled set of PRs (true bugs vs false positives); human override rate.
- **Latency:** p95 time from webhook to posted review for typical diff sizes.
- **Cost:** Tokens + embedding refresh per PR; cost per merged PR.
- **User satisfaction:** Thumbs on comments, time saved in review meetings, adoption by team.
- **Failure rate:** Schema invalid outputs, tool timeouts, policy violations (commenting on out-of-scope files).

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented APIs or file paths; mitigated by citations, tool grounding, and blocking claims without line anchors.
- **Tool failures:** Rate limits, partial fetches, binary files; mitigated by retries, size caps, graceful “insufficient context” states.
- **Latency issues:** Large monorepo diffs; mitigated by chunking, incremental review, and background jobs with check-run updates.
- **Cost spikes:** Re-review on every push without diff fingerprinting; mitigated by debouncing and caching embeddings.
- **Incorrect decisions:** High-severity false positives erode trust; mitigated by calibrated severity, human feedback loop, and canary rollouts per repo.

---

## 🏭 Production Considerations

- **Logging and tracing:** Correlate all spans with `installation_id`, `repo`, `pr_number`, `head_sha`.
- **Observability:** Metrics for tool errors, token usage, comment dedupe hits, and human dismissal reasons.
- **Rate limiting:** Per installation and per repo; backoff on GitHub secondary limits.
- **Retry strategies:** Idempotent webhook handling; at-most-once comment posting with stored fingerprints.
- **Guardrails and validation:** Path allowlists, secret scanning on outbound prompts, PII redaction in logs, “advisory only” merge semantics.
- **Security considerations:** Treat tokens as tenant secrets; never exfiltrate private code to unauthorized models; SOC2-style audit log of tool reads.

---

## 🚀 Possible Extensions

- **Add UI:** Reviewer console to accept/reject rules and train rubrics.
- **Convert to SaaS:** Multi-tenant GitHub App with per-org policy packs.
- **Add multi-agent collaboration:** Separate security/perf agents with merge layer once metrics justify complexity.
- **Add real-time capabilities:** Inline IDE hints via extension consuming the same API.
- **Integrate with external systems:** Jira/Linear linking, SAST issue correlation.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with deterministic checks, add LLM narrative, add tools, consolidate into one accountable agent, split only with measured lift.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Tool-grounded** review design (evidence-first comments)
  - **RAG** with hard ACL and scope limits in a code host environment
  - **Structured outputs** for machine-consumable findings
  - **System design thinking** for developer trust: severity calibration, deduplication, and auditability
