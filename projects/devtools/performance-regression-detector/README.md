System Type: Workflow  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Monitoring, Analytics  

# Performance Regression Detector

## 🧠 Overview
A **workflow pipeline** that ingests **benchmark artifacts** (k6, Lighthouse CI, custom microbench JSON) and **APM golden traces**, compares against **rolling baselines** with **statistical gates**, and files **regression tickets** with **diff-attribution** links—LLM optional for **natural language summaries** of numeric deltas only.

---

## 🎯 Problem
Perf regressions slip through CI because thresholds are static noise; prod drift is noticed only after customer complaints.

---

## 💡 Why This Matters
- **Pain it removes:** Mystery latency spikes, bloated bundles, and flaky “red but ignored” dashboards.
- **Who benefits:** Frontend and backend teams shipping TypeScript services at high velocity.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Ingest → normalize metrics → baseline model → anomaly decision → notify is inherently orchestration.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-metric correlation + environment stratification + historical seasonality; L5 adds fleet-wide causal analysis with heavy data engineering.

---

## 🏭 Industry
Example:
- DevTools / SRE / frontend platform

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — links to recent PRs touching hot paths
- Planning — bounded (which tests to rerun bisecting)
- Reasoning — optional narrative from structured tables
- Automation — GitHub status checks, ticket creation
- Decision making — bounded (regression yes/no with confidence)
- Observability — **in scope**
- Personalization — per-service SLO weights
- Multimodal — optional filmstrip for Lighthouse regressions

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** ingest API
- **ClickHouse** or **BigQuery** for time-series metrics
- **Temporal**/**Inngest** for compare + bisect workflows
- **stats-ts** or Python sidecar for robust stats if needed
- **OpenTelemetry**, **Grafana**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** CI uploads, scheduled prod canary probes.
- **LLM layer:** Optional comment generator from tabular diff JSON.
- **Tools / APIs:** Git provider for blame range, bundle analyzer artifacts.
- **Memory (if any):** Baseline store per `(service, scenario, commit)` windows.
- **Output:** PR checks, Slack alerts, bisect jobs.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single metric threshold on one benchmark in CI.

### Step 2: Add AI layer
- LLM summarizes top regressions for weekly report from CSV.

### Step 3: Add tools
- Pull OTel span breakdowns; attribute latency to service edges.

### Step 4: Add memory or context
- Seasonal baselines (e.g., Black Friday shape) per region.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent proposes bisect steps—executor remains deterministic workflow.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall vs human-labeled regressions on historical data.
- **Latency:** Ingest→decision within CI budget; async path for deep dives.
- **Cost:** Warehouse query $ + CI minutes for bisect replay suites.
- **User satisfaction:** Reduction in escaped regressions; fewer false positives.
- **Failure rate:** Flaky tests flip-flopping baselines; environment skew false alarms.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** If LLM used, must not invent numbers—attach tables only.
- **Tool failures:** Missing spans; degrade to coarser metrics with warning banner.
- **Latency issues:** Heavy trace queries; preaggregate service graphs nightly.
- **Cost spikes:** Bisect storms; cap depth and require manual approval for expensive suites.
- **Incorrect decisions:** CPU noise on shared CI; mitigate with dedicated perf runners and repeated sampling.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store metric tuples + commit SHAs; PII-free spans.
- **Observability:** Detector’s own SLOs, baseline freshness, flake scores per test.
- **Rate limiting:** Per-repo upload caps; dedupe identical artifacts.
- **Retry strategies:** Idempotent uploads keyed by `(repo, commit, scenario)`.
- **Guardrails and validation:** Require minimum sample size before failing builds.
- **Security considerations:** Signed uploads, tenant isolation for proprietary benchmarks.

---

## 🚀 Possible Extensions

- **Add UI:** Flamegraph diff viewer integrated with PRs.
- **Convert to SaaS:** Hosted perf registries with org policies.
- **Add multi-agent collaboration:** FE vs BE specialists debating shared bottlenecks (structured debate log).
- **Add real-time capabilities:** Live shadow traffic comparison (advanced).
- **Integrate with external systems:** Datadog, Honeycomb, Grafana Cloud, Buildkite annotations.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **measurement discipline** before “smart” explanations.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Statistical baselines** for noisy metrics
  - **CI perf** hygiene
  - **Trace-driven** attribution
  - **System design thinking** for developer signal quality
