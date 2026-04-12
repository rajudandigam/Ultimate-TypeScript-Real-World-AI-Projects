System Type: Agent  
Complexity: Level 2  
Industry: DevTools  
Capabilities: Validation, Reasoning  

# API Design Validator

## 🧠 Overview
A **design-review agent** for **OpenAPI/AsyncAPI** specs and **handwritten RFCs** that checks **consistency**, **versioning**, **error models**, **pagination**, **auth**, and **breaking-change risk**—using tools to **parse specs** and **diff** against the previous tag. It is a **linter++**: suggestions cite **spec clauses** and **org style guide** snippets, not vibes-only opinions.

---

## 🎯 Problem
APIs ossify with inconsistent patterns; human review misses subtle breaking changes across large OpenAPI files.

---

## 💡 Why This Matters
- **Pain it removes:** Client SDK churn, surprise 404 semantics, and unclear error handling for integrators.
- **Who benefits:** API platform teams and service owners in TypeScript-first API shops.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `parse_openapi`, `diff_schemas`, `check_style_rules`, `link_rfc_section`.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Deterministic parsers + LLM narration + light retrieval from style guides; L3+ adds cross-repo consumer contract tests and richer governance workflows.

---

## 🏭 Industry
Example:
- DevTools / API platform

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal API guidelines, exemplar specs
- Planning — bounded (ordered checklist per PR)
- Reasoning — bounded (breaking change severity)
- Automation — GitHub check annotations
- Decision making — bounded (pass/warn/fail)
- Observability — **in scope**
- Personalization — per-domain rule packs (payments vs internal)
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** GitHub Action / bot
- **openapi-diff**/**oas-kit**/**@apidevtools/swagger-parser**
- **OpenAI SDK** with structured `Finding[]` output
- **Postgres** optional for guideline embeddings
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** PR changing `openapi.yaml`, `/api-review` command.
- **LLM layer:** Agent converts parser diagnostics + diff into human-readable findings.
- **Tools / APIs:** Spec parser, JSON Schema validator, git diff of prior release artifact.
- **Memory (if any):** Style guide RAG; org exception registry.
- **Output:** Inline review comments + summary check conclusion.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic Spectral rules only.

### Step 2: Add AI layer
- LLM explains Spectral failures with doc links.

### Step 3: Add tools
- Structural OpenAPI diff for breaking changes; semver classifier.

### Step 4: Add memory or context
- Retrieve similar past PRs and accepted exceptions with expiry.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional second agent plays “SDK consumer” with example generated types.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Agreement with human API council on labeled PRs; missed breaking change rate.
- **Latency:** p95 review time under CI budgets.
- **Cost:** Tokens per PR; cache hits on unchanged paths.
- **User satisfaction:** Reduced review cycles; fewer post-release hotfixes.
- **Failure rate:** False breaking alarms, contradictory guidance, secret leakage in pasted specs.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claims a field exists when parser disagrees; always attach machine diagnostics.
- **Tool failures:** Invalid YAML; fail fast with line/col references, no LLM guess-fix in CI.
- **Latency issues:** Huge bundled specs; split and incremental analysis.
- **Cost spikes:** Massive generated specs; `.spectralignore` patterns + path filters.
- **Incorrect decisions:** Blocking additive changes; tune semver policy with org exceptions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store finding codes + spec hashes; avoid logging bearer tokens embedded in examples.
- **Observability:** Override rates, noise per rule, time-to-review.
- **Rate limiting:** Per-repo concurrency; protect shared LLM budget.
- **Retry strategies:** Idempotent PR comment updates keyed by `(pr, spec_sha)`.
- **Guardrails and validation:** Strip example auth headers; block posting raw production URLs.
- **Security considerations:** Treat specs as sensitive; SSO for guideline retrieval.

---

## 🚀 Possible Extensions

- **Add UI:** Spec explorer with diff heatmap vs previous release.
- **Convert to SaaS:** Hosted API governance with org-wide dashboards.
- **Add multi-agent collaboration:** Security reviewer for authz patterns only.
- **Add real-time capabilities:** IDE extension on save (local).
- **Integrate with external systems:** Stoplight, Postman, ReadMe.com, Buf Schema Registry.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **deterministic signals** as the authority; LLM explains and triages.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **OpenAPI** quality engineering
  - **Breaking change** detection
  - **CI bots** with safe prompts
  - **System design thinking** for developer-facing governance
