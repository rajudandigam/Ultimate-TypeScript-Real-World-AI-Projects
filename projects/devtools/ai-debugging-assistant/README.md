System Type: Agent  
Complexity: Level 4  
Industry: DevTools  
Capabilities: Reasoning, Tool usage  

# AI Debugging Assistant

## 🧠 Overview
An **on-call copilot** that ingests **logs, traces, and metrics context** for a failing service, uses **tool calls** against observability backends and deployment metadata, and returns **hypothesis-ranked** findings with reproduction steps—positioned as **acceleration**, not a replacement for engineering judgment.

---

## 🎯 Problem
Incidents generate huge unstructured signals. Engineers lose time pivoting between logs, traces, dashboards, and deploy timelines. Generic “paste your error” chat lacks **tenant-specific** context and safe access patterns, so it either hallucinates or becomes useless.

---

## 💡 Why This Matters
- **Pain it removes:** Slow MTTR from context switching, underused telemetry investments, and stale runbooks.
- **Who benefits:** Service owners, SREs, and developers in organizations with mature OpenTelemetry but immature incident habits.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Debugging sessions are inherently **sequential** and **stateful** within one incident thread. A single agent with a curated tool suite (query logs, fetch trace, list deploys) matches how engineers actually work. Multi-agent is usually unnecessary until you isolate **write** actions (e.g., restart pod) behind a separate approval path.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4 in **operational depth**: broad tool surface, strict budgets, advanced trace/log correlation, and integration with org topology—implemented as a **single agent** unless evaluation proves multi-agent lift.

---

## 🏭 Industry
Example:
- DevTools (observability platforms, internal developer portals)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (runbooks, prior incidents)
- Planning — **in scope** (investigation plan steps)
- Reasoning — **in scope**
- Automation — optional (create ticket, post Slack update)
- Decision making — bounded (rank hypotheses, never auto-remediate without policy)
- Observability — **core** (the product consumes it)
- Personalization — optional (service-specific playbooks)
- Multimodal — optional (screenshots)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (incident room UI) or **VS Code extension** host
- **Node.js + TypeScript**
- **OpenAI Agents SDK** (tool loops with budgets)
- **OpenTelemetry** backends (Jaeger/Tempo, Loki, Prometheus) via typed query tools
- **Kubernetes / cloud vendor APIs** (read-only metadata tools)
- **Postgres** (session transcripts, evidence objects)
- **OpenTelemetry** for the assistant itself

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** `service`, `time_range`, `symptom`, optional trace IDs; SSO context for tenant.
- **LLM layer:** Agent iterates with tools until budget or confidence threshold; emits structured incident memo.
- **Tools / APIs:** Log query, metric query, trace fetch, deploy events, feature flags, recent PRs for service.
- **Memory (if any):** Retrieve similar resolved incidents; session memory for follow-up questions.
- **Output:** Hypothesis list with embedded queries, “next commands,” and explicit unknowns.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static links to dashboards + top queries copied from templates.

### Step 2: Add AI layer
- LLM narrates known signals from a small pre-fetched bundle.

### Step 3: Add tools
- Implement safe, templated queries with mandatory time bounds and label matchers.

### Step 4: Add memory or context
- Index incident writeups with service tags for retrieval on similar alerts.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional: separate **remediation** agent with no read access to customer secrets—only if you add automated actions.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human-rated usefulness; rate of hypotheses matching postmortem root cause.
- **Latency:** Time to first actionable query set under on-call stress.
- **Cost:** Tokens + query cost per incident; must not amplify telemetry spend.
- **User satisfaction:** Thumbs on memos, reduction in repeated questions in Slack.
- **Failure rate:** Tool timeouts, query cardinality explosions, unsafe query attempts blocked.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented span IDs or metric values; mitigated by requiring copied query results as evidence objects.
- **Tool failures:** Backend limits, empty results; mitigated by teaching the agent to widen/narrow queries systematically.
- **Latency issues:** Large log windows; mitigated by progressive sampling and strict byte caps.
- **Cost spikes:** Runaway tool loops; mitigated by max iterations, per-tool budgets, and circuit breakers.
- **Incorrect decisions:** Dangerous suggested commands; mitigated by allowlisted operations and copy-paste-only remediation in v1.

---

## 🏭 Production Considerations

- **Logging and tracing:** Audit every query with user identity; redact secrets from returned payloads before model prompts.
- **Observability:** Track tool latency, loop counts, refusal reasons, and human override patterns.
- **Rate limiting:** Per user and per service to protect shared telemetry backends.
- **Retry strategies:** Backoff on query APIs; cancel long-running queries client-side.
- **Guardrails and validation:** Query templates validated server-side; deny full-table scans; PII filters on log lines.
- **Security considerations:** Treat telemetry as sensitive; SSO; scoped service accounts; no cross-tenant data mixing.

---

## 🚀 Possible Extensions

- **Add UI:** Query replay buttons and evidence pinning to incident timeline.
- **Convert to SaaS:** Hosted connectors with customer-managed keys.
- **Add multi-agent collaboration:** Investigator vs remediator split with hard permission boundaries.
- **Add real-time capabilities:** Live tail with incremental memo updates.
- **Integrate with external systems:** PagerDuty, Jira, status pages.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove safe read-only assistance before any write automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Tool-first** incident investigation UX
  - **Query budgeting** and safe templates
  - **Evidence objects** instead of vibes-based “root cause”
  - **System design thinking** for developer trust under pressure
