System Type: Agent  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Validation, Reasoning  

# AI API Contract Validator

## 🧠 Overview
A **tool-using agent** that compares **OpenAPI (or AsyncAPI) specs** across branches or environments, highlights **breaking changes**, and explains impact with **operation-level citations**—integrated into PR checks or publish pipelines so API drift is caught before clients break.

---

## 🎯 Problem
APIs evolve constantly. Teams miss breaking changes: required fields added, enums narrowed, response types reshaped. Diffing raw YAML is noisy; humans skim. You need **semantic** validation plus **consumer-oriented** explanations tied to spec fragments, not a generic summary.

---

## 💡 Why This Matters
- **Pain it removes:** Silent client failures, emergency rollbacks, and tribal knowledge about which teams own which breaking rules.
- **Who benefits:** API platform teams, BFF maintainers, and any org publishing **versioned** HTTP or event contracts.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Contract review is a **single coherent diff task** with tools (`parse_spec`, `diff_operations`, `load_consumer_usage` if available). Multi-agent rarely helps unless you isolate **security-sensitive** schema review behind a separate policy pass.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Add **retrieval** over internal guidelines (“how we version”, deprecation policy) and historical breaking PRs to calibrate severity and messaging.

---

## 🏭 Industry
Example:
- DevTools (API lifecycle, developer portals, SDK publishing)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (API standards, past ADRs)
- Planning — light (ordered checks: paths, schemas, security schemes)
- Reasoning — **in scope**
- Automation — **in scope** (GitHub check annotations, Slack digests)
- Decision making — bounded (breaking vs safe-with-caveats)
- Observability — **in scope**
- Personalization — optional (per-service stricter rules)
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **@apidevtools/swagger-parser** / **openapi-diff** libraries (deterministic diff first)
- **OpenAI Agents SDK** (narration + classification on top of structured diff)
- **Postgres** (spec snapshots, audit)
- **GitHub/GitLab APIs** for PR comments and check runs
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Two spec URLs or git SHAs; optional consumer registry version pins.
- **LLM layer:** Agent reads **structured diff objects** (not only text) and produces human explanations + severity.
- **Tools / APIs:** Parse/validate specs, compute semantic diff, fetch codegen usage or analytics if allowed.
- **Memory (if any):** Retrieve internal “compatibility matrix” docs; store labeled examples for fine-tuning or eval.
- **Output:** Check run with annotated operations, machine-readable `breaking[]` list for gates.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic OpenAPI diff tool in CI; fail build on configured rule IDs.

### Step 2: Add AI layer
- LLM turns diff JSON into reviewer-friendly paragraphs with links to spec lines.

### Step 3: Add tools
- Tools to fetch consumer traffic patterns or pinned SDK versions (if data exists).

### Step 4: Add memory or context
- RAG over API guidelines; few-shot examples of accepted vs rejected breaks.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional security-focused second pass for authz changes—merge via deterministic rule engine.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Agreement with expert labels on breaking vs non-breaking; false block rate.
- **Latency:** p95 time for PR-sized specs under check budget.
- **Cost:** Tokens per diff after summarizing large specs.
- **User satisfaction:** Reviewer time saved, fewer hotfix releases.
- **Failure rate:** Parser errors, invalid specs slipping through, model contradicting deterministic diff.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claiming breaks not in diff output; mitigated by grounding: model must reference `diff_id` keys only.
- **Tool failures:** Huge specs exceeding limits; mitigated by chunking by tag/path and summarizing leaf diffs.
- **Latency issues:** Deep reference cycles in JSON Schema; mitigated by pre-normalization and caching.
- **Cost spikes:** Re-running full analysis on every commit; mitigated by hashing specs and reusing prior results.
- **Incorrect decisions:** Allowing true breaks through; mitigated by hard rules for MUST-level changes regardless of LLM opinion.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store spec hashes, diff engine version, model version; no secrets from specs in logs without scrubbing.
- **Observability:** Track override rate when humans dismiss checks; track parser failures by format.
- **Rate limiting:** Per repo on expensive operations; parallelize by path groups safely.
- **Retry strategies:** Idempotent check runs keyed by `(pr, base_sha, head_sha, ruleset_version)`.
- **Guardrails and validation:** Never let the model override deterministic **fail** rules silently.
- **Security considerations:** Treat specs as sensitive IP; tenant isolation; SSRF-safe URL fetch for remote specs.

---

## 🚀 Possible Extensions

- **Add UI:** Visual diff of operations with consumer blast-radius estimates.
- **Convert to SaaS:** Hosted registry with compatibility scoring across tenants.
- **Add multi-agent collaboration:** SDK maintainer agent proposing version bumps alongside API change.
- **Add real-time capabilities:** Live validation in design tools via Language Server style API.
- **Integrate with external systems:** Backstage, Apigee, Kong, AWS API Gateway export sync.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep deterministic diff as source of truth; LLM explains and triages, not invents breaks.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Semantic API diffing** vs text diff
  - **Grounded** LLM outputs on structured artifacts
  - **CI gate** design for developer experience
  - **System design thinking** for compatibility at scale
