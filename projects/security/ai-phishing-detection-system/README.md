System Type: Agent  
Complexity: Level 4  
Industry: Security / Cybersecurity  
Capabilities: Classification, Detection  

# AI Phishing Detection System

## 🧠 Overview
A **tool-using security agent** that classifies inbound email and messaging artifacts as **phishing, suspicious, or benign** using **structured signals** (headers, URLs, attachments metadata, reputation lookups) plus **bounded LLM reasoning** for novel social-engineering patterns—designed so analysts can **audit** every high-risk decision and so false positives do not silently block legitimate business mail without policy tiers.

---

## 🎯 Problem
Rule-only filters miss spear-phishing and fast-rotating infrastructure; naive LLM-only classifiers **hallucinate** evidence and leak sensitive mail content into logs. Production needs **deterministic gates**, **explainable features**, and **human-in-the-loop** escalation paths.

---

## 💡 Why This Matters
- **Pain it removes:** Analyst overload, delayed triage, and inconsistent user reporting quality.
- **Who benefits:** Security operations teams, MSPs, and email security vendors integrating into existing MTA/SIEM stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Phishing triage is a **single analyst-style agent** with tools for sandbox metadata, URL expansion, and threat intel lookups. Multi-agent is optional only if separating **content extraction** from **verdict synthesis** for isolation.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You are combining **classification**, **external intel tools**, and **SOC workflows** without claiming full malware sandbox parity unless extended to L5.

---

## 🏭 Industry
Example:
- Security / Cybersecurity (email security, messaging abuse, insider risk adjacent)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (internal playbooks, past similar cases—redacted)
- Planning — bounded (triage steps)
- Reasoning — bounded (attack narrative vs benign explanation)
- Automation — optional (auto-quarantine with policy)
- Decision making — bounded (risk score + recommended action)
- Observability — **in scope**
- Personalization — optional (per-tenant tuning)
- Multimodal — optional (image QR in PDFs—careful pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** (ingestion workers)
- **Postgres** (cases, verdicts, audit)
- **Redis** (rate limits, URL cache)
- **OpenAI SDK** / **Vercel AI SDK** (structured outputs)
- **VirusTotal / URLhaus** style APIs (as tools)
- **OpenTelemetry** (PII-safe spans)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Webhook from MTA, analyst UI, user “report phishing” button.
- **LLM layer:** Agent produces `Verdict` + `evidence[]` referencing only tool-returned facts.
- **Tools / APIs:** Header parser, URL expander, domain age, attachment hash reputation, sandbox job submit (optional).
- **Memory (if any):** Tenant-specific allow/deny patterns and historical false-positive corrections.
- **Output:** SIEM event, ticket, or quarantine action per policy tier.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic rules + blocklists; no LLM in path.

### Step 2: Add AI layer
- LLM summarizes analyst-facing narrative from structured JSON only.

### Step 3: Add tools
- Add URL expansion and intel APIs behind caching and quotas.

### Step 4: Add memory or context
- Retrieve similar closed cases (hashed identifiers, no raw body by default).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional extractor microservice for MIME parsing vs verdict agent.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall on labeled corpora; cost per true positive at fixed FPR.
- **Latency:** p95 triage time vs SLA for near-real-time delivery paths.
- **Cost:** Tokens + API calls per message at scale.
- **User satisfaction:** Analyst time saved; disputed quarantine rate.
- **Failure rate:** Missed phish in holdout sets; automation-induced outages.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Cited nonexistent URLs; mitigated by evidence schema tied to tool outputs only.
- **Tool failures:** Intel API downtime; mitigated by degraded mode + explicit uncertainty flags.
- **Latency issues:** Sandbox latency; mitigated by async path and partial scoring.
- **Cost spikes:** Re-analyzing bulk threads; mitigated by dedupe keys and sampling policies.
- **Incorrect decisions:** Blocking payroll or MFA emails; mitigated by tiered automation, appeals workflow, and domain allowlists with governance.

---

## 🏭 Production Considerations

- **Logging and tracing:** Never log raw credentials or full message bodies by default; field-level redaction.
- **Observability:** Verdict distribution drift, tool error rates, analyst override rates.
- **Rate limiting:** Per tenant and per sender hash; protect intel API keys.
- **Retry strategies:** Idempotent case creation; safe replays for webhooks.
- **Guardrails and validation:** Schema validation on verdicts; block autonomous domain-wide blocks without role approval.
- **Security considerations:** Secrets management, tenant isolation, tamper-evident audit trail, legal hold workflows.

---

## 🚀 Possible Extensions

- **Add UI:** Analyst cockpit with diffable evidence and one-click false-positive feedback.
- **Convert to SaaS:** Multi-tenant scoring with per-tenant model routing.
- **Add multi-agent collaboration:** Separate malware specialist agent with stricter tool scopes.
- **Add real-time capabilities:** Streaming verdicts for live chat abuse.
- **Integrate with external systems:** SOAR playbooks, Jira/ServiceNow, cloud email APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **shadow mode** (observe-only) before any auto-quarantine.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Evidence-first** LLM outputs in security
  - **PII minimization** in detection pipelines
  - **Policy tiers** for automation vs human review
  - **System design thinking** for mail-scale ingestion
