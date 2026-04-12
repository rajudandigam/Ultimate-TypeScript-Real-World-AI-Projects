System Type: Agent  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Orchestration  

# REST API Orchestration Agent

## 🧠 Overview
A **tool-using agent** that executes **multi-step REST workflows** (OAuth token exchange, paginated list → detail fetch → mutation) from **declarative recipes** plus **natural-language goals**—each step’s inputs are **validated** against **OpenAPI** or stored JSON Schemas, with **redacted logging** and **idempotency keys** for unsafe verbs.

---

## 🎯 Problem
Engineers glue APIs with throwaway scripts that lack **retries**, **auth refresh**, and **clear audit trails**; “agent does HTTP” without guardrails becomes a security incident.

---

## 💡 Why This Matters
- **Pain it removes:** Brittle integration scripts, inconsistent error handling, and opaque failures in cross-service onboarding.
- **Who benefits:** Internal platform teams and solution engineers wiring SaaS APIs (Salesforce, Stripe, etc.) in TypeScript services.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Dynamic branching fits an agent; **persistence and compensation** should still use a **workflow engine** beneath for production (hybrid acceptable in brief).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-step tool calls + schema validation + secret injection via vault; L4+ adds multi-agent split (planner vs executor) and formal workflow provenance.

---

## 🏭 Industry
Example:
- DevTools / integration engineering

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal API playbooks
- Planning — bounded (step DAG from goal)
- Reasoning — bounded (error interpretation)
- Automation — **in scope**
- Decision making — bounded (retry vs fail)
- Observability — **in scope**
- Personalization — per-tenant connector configs
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** with **undici** / **fetch** wrappers
- **OpenAI SDK** tool calling; **Zod** for response validation
- **HashiCorp Vault** / cloud secret managers
- **Temporal** for durable saga (recommended alongside agent)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Goal text + selected **connector** + environment.
- **LLM layer:** Agent selects next tool call from allowed set.
- **Tools / APIs:** `http_request` (sandboxed allowlist), `refresh_token`, `parse_page`, `emit_event`.
- **Memory (if any):** Ephemeral run state; no long-term secrets in model context.
- **Output:** Structured run report + artifacts (JSON bodies redacted).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fixed 3-step recipe in code with no LLM.

### Step 2: Add AI layer
- LLM maps user intent to a known recipe id only.

### Step 3: Add tools
- Generic HTTP tool with host allowlist + schema validation on responses.

### Step 4: Add memory or context
- Store run checkpoints in workflow DB for resume.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Planner agent outputs DAG JSON validated by policy engine before executor runs.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** % successful runs on golden integration tests vs hand scripts.
- **Latency:** End-to-end p95 for typical recipes.
- **Cost:** Tokens per run; HTTP volume.
- **User satisfaction:** Time to onboard a new API connector.
- **Failure rate:** SSRF, token leakage, double-charges on retried POSTs.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented endpoints; mitigated OpenAPI-driven tool parameterization.
- **Tool failures:** 429/5xx storms; exponential backoff + jitter; respect `Retry-After`.
- **Latency issues:** Pagination loops; max page caps and streaming progress.
- **Cost spikes:** Runaway loops; max steps per run and spend alarms.
- **Incorrect decisions:** Retrying non-idempotent mutations; require explicit idempotency keys and dedupe store.

---

## 🏭 Production Considerations

- **Logging and tracing:** Trace ids per run; redact auth headers and PII fields by policy.
- **Observability:** Per-connector success rates, latency histograms, policy denials.
- **Rate limiting:** Per tenant and per upstream API contract.
- **Retry strategies:** Only on safe verbs unless idempotency proven.
- **Guardrails and validation:** Host allowlists, mTLS where required, schema validation on every response body.
- **Security considerations:** Secret injection at runtime, never into prompts; audit all mutations.

---

## 🚀 Possible Extensions

- **Add UI:** Visual recipe debugger with step replay.
- **Convert to SaaS:** Connector marketplace with signed recipes.
- **Add multi-agent collaboration:** Security reviewer agent for new connectors.
- **Add real-time capabilities:** WebSocket upstreams with streaming tool.
- **Integrate with external systems:** Zapier-like catalog, MCP-exposed connectors.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **allowlisted** HTTP and **schema-validated** bodies.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Safe** HTTP tool design
  - **Saga** patterns with agents
  - **OpenAPI**-driven orchestration
  - **System design thinking** for integration copilots
