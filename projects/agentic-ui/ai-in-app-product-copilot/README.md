System Type: Agent  
Complexity: Level 4  
Industry: Agentic UI  
Capabilities: Assistance, Context Awareness  

# AI In-App Product Copilot

## 🧠 Overview
An **embedded product agent** that reads **sanitized application context** (route, feature flags, selected records, visible form schema) from your SaaS client via a **trusted bridge**, suggests **next best actions**, and can **propose** UI operations as **structured intents** your host app validates and executes—so the copilot **never** becomes an uncontrolled remote-control of customer data.

---

## 🎯 Problem
Generic chat sidebars lack page awareness and create unsafe “click here” advice. Real in-app copilots need **schema-bound tools**, **permission parity** with the logged-in user, and **deterministic** execution paths the frontend can audit.

---

## 💡 Why This Matters
- **Pain it removes:** Support load from “where do I click?”, shallow onboarding, and feature discovery gaps.
- **Who benefits:** B2B SaaS teams shipping TypeScript/React products with strict tenant isolation.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One copilot session maps cleanly to **one user’s entitlements** and **one app surface**. Multi-agent splits rarely help unless isolating **write** tools behind a separate executor service.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You integrate **context packaging**, **tool allowlists**, **human confirmation** for mutations, and **evaluation** of suggestion quality in production.

---

## 🏭 Industry
Example:
- Agentic UI (in-app copilots, embedded assistants, command palettes with AI)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (in-app help docs, release notes index)
- Planning — bounded (multi-step guided flows)
- Reasoning — bounded (explain why an action is blocked)
- Automation — **in scope** (propose intents: open drawer, prefill filter—not raw DOM clicks)
- Decision making — bounded (rank next actions from analytics-backed templates)
- Observability — **in scope**
- Personalization — optional (role-based playbooks)
- Multimodal — optional (screenshot-to-context with redaction pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **React** + **TypeScript** (host app SDK: context provider + intent dispatcher)
- **Next.js** or **Vite** BFF for copilot sessions
- **Vercel AI SDK** / **OpenAI Agents SDK**
- **Postgres** (session transcripts metadata, not full PII by default)
- **OpenTelemetry** (redacted spans)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Client sends `AppContext` snapshot (versioned schema) + user question.
- **LLM layer:** Agent emits `CopilotIntent[]` validated against JSON Schema.
- **Tools / APIs:** Server tools mirroring product APIs (same RBAC as REST).
- **Memory (if any):** Short session summary; optional org-specific doc RAG.
- **Output:** Host renders intents or asks clarifying questions; all mutations go through app code.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static help panel keyed by route; no model.

### Step 2: Add AI layer
- LLM answers from route id + fixed FAQ strings only.

### Step 3: Add tools
- Add read-only tools: fetch record, list fields, explain validation error codes.

### Step 4: Add memory or context
- Add session summary across steps within one workspace visit.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional executor microservice for write intents with idempotency keys.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Intent validity rate (rejected by host validator); task completion on labeled journeys.
- **Latency:** p95 time to first token / first intent under typical context size.
- **Cost:** Tokens per active seat per day.
- **User satisfaction:** Feature adoption, support ticket reduction, qualitative ease scores.
- **Failure rate:** Wrong navigation suggestions, permission leaks, UX dead-ends.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented menu paths; mitigated by intent catalog + server-side route existence checks.
- **Tool failures:** API errors mid-flow; mitigated by structured error propagation to the model and user.
- **Latency issues:** Huge context payloads; mitigated by summarization tiers and field allowlists.
- **Cost spikes:** Logging full page HTML to the model; mitigated by strict context contracts and hashing.
- **Incorrect decisions:** Suggesting bulk delete or export; mitigated by capability tiers, confirmations, and rate limits.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log intent types and outcomes, not customer record payloads by default.
- **Observability:** Tool error taxonomy, permission denials, model refusal rates, client SDK version drift.
- **Rate limiting:** Per tenant and per user; detect automated probing of tools.
- **Retry strategies:** Idempotent server tools; safe replay for client network blips.
- **Guardrails and validation:** JSON Schema validation on every intent; CSP and iframe policies for embedded widgets.
- **Security considerations:** Tenant isolation, OAuth scopes, prompt-injection defenses (sanitize user-controlled labels in context), SOC2 readiness.

---

## 🚀 Possible Extensions

- **Add UI:** Command palette with fuzzy actions + natural language.
- **Convert to SaaS:** Copilot platform with per-tenant tool packs and analytics.
- **Add multi-agent collaboration:** Separate “data analyst” read-only agent for SQL-heavy modules.
- **Add real-time capabilities:** Streaming partial intents for responsive UX.
- **Integrate with external systems:** Salesforce, HubSpot, internal admin APIs via MCP.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start **read-only** suggestions; add writes only with receipts and confirmations.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Intent-based** UI automation vs brittle DOM scraping
  - **Permission parity** between UI and agent tools
  - **Context contracts** between client and model
  - **System design thinking** for embedded AI in products
