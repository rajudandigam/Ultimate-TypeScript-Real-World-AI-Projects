System Type: Agent  
Complexity: Level 4  
Industry: DevTools  
Capabilities: Planning  

# Long-Running Coding Agent (Task Decomposition Engine)

## 🧠 Overview
A **persistent coding agent** that **decomposes** large tasks into **checklisted substeps**, executes them in a **sandboxed repo** with **tool loops** (`read_file`, `apply_patch`, `run_tests`, `open_pr`), and **checkpoints** state so work can resume across sessions—**human merge** remains the gate; the agent does not bypass branch protection.

---

## 🎯 Problem
One-shot codegen fails on multi-file refactors; teams need **incremental** execution with **verifiable** milestones and **auditable** history.

---

## 💡 Why This Matters
- **Pain it removes:** Half-done AI refactors, untested bulk edits, and opaque “it tried something” outcomes.
- **Who benefits:** Staff engineers and platform teams automating migrations and large internal chores.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using) with **external orchestration** (workflow for checkpoints/leases)

The “engine” is **orchestration + state machine** around one primary agent to keep accountability clear; L4 reflects planning depth and infra surface area.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Long-horizon planning, sandbox CI, PR lifecycle, and org policy—bordering L5 when you add fleet-wide autonomy and formal verification.

---

## 🏭 Industry
Example:
- DevTools / autonomous software engineering (governed)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — codebase index, ADRs, prior PRs
- Planning — **in scope** (task DAG, rollback points)
- Reasoning — bounded (tradeoffs, test strategy)
- Automation — PR creation, CI triggers
- Decision making — bounded (next step selection)
- Observability — **in scope**
- Personalization — org coding standards
- Multimodal — optional design mock inputs

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** worker + **OpenAI SDK** / **Anthropic** tools
- **Temporal** for durable sessions, heartbeats, and resume tokens
- **Docker** / **Firecracker** sandboxes for test execution
- **Postgres** for plan graph + checkpoints
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Task spec (markdown), repo + branch, budget caps.
- **LLM layer:** Primary agent with strict tool schemas and step budgets.
- **Tools / APIs:** Git, CI, issue tracker, code index, test runner.
- **Memory (if any):** Checkpointed plan state; vector index over repo chunks.
- **Output:** Branch commits, PRs, human-readable plan log.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single-session patch for one file with manual approval.

### Step 2: Add AI layer
- LLM proposes step list; human approves before execution.

### Step 3: Add tools
- Sandboxed run_tests; block network egress except package registry allowlist.

### Step 4: Add memory or context
- Persist checkpoints after each green test milestone.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional reviewer agent that only comments (no write tools).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** % tasks completed to spec on benchmark repos without human takeover.
- **Latency:** Wall clock per task vs human baseline (pilot).
- **Cost:** Tokens + CI minutes per task.
- **User satisfaction:** Edit distance on merged PRs; trust scores.
- **Failure rate:** Infinite loops, destructive edits, secret exfiltration attempts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claims tests passed without tool evidence; require tool receipts in context.
- **Tool failures:** Flaky CI; backoff and quarantine steps, not blind retries that mutate more.
- **Latency issues:** Large repos; narrow workspace mounts and incremental indexing.
- **Cost spikes:** Unbounded replanning; cap replans and require human fork.
- **Incorrect decisions:** Subtle security vulnerabilities introduced at scale; mandatory diff review for sensitive paths.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit of tool calls and outputs (redacted).
- **Observability:** Step success rates, sandbox escape attempts, token burn rate.
- **Rate limiting:** Per user/org concurrency; global sandbox pool limits.
- **Retry strategies:** Idempotent git operations; lease renewal for long jobs.
- **Guardrails and validation:** Path allowlists, secret scanning on patches, CODEOWNERS for hot paths.
- **Security considerations:** Sandboxing, credential injection via OIDC short-lived tokens, no raw long-lived PATs in agent context.

---

## 🚀 Possible Extensions

- **Add UI:** Plan DAG visualization with manual reorder.
- **Convert to SaaS:** Multi-tenant long-running agent product.
- **Add multi-agent collaboration:** Implementer + reviewer + tester roles with strict tool separation.
- **Add real-time capabilities:** Streaming thought summaries to Slack (policy-governed).
- **Integrate with external systems:** GitHub Projects, Jira, Linear.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **checkpointed** reliability before expanding tool power.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Durable execution** for coding agents
  - **Sandbox** design for untrusted codegen
  - **Human-in-the-loop** merge discipline
  - **System design thinking** for long-horizon autonomy
