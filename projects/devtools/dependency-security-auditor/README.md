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
