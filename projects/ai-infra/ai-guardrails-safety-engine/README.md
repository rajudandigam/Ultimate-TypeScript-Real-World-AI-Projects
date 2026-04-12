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
