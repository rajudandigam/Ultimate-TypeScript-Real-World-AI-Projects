System Type: Multi-Agent  
Complexity: Level 5  
Industry: Fintech  
Capabilities: Detection, Analysis  

# AML Investigation Multi-Agent System

## 🧠 Overview
A **multi-agent AML investigation workspace** where a **pattern detector agent** proposes hypotheses from transactions and graph features, a **narrative analyst agent** drafts **SAR-ready** structured summaries from **evidence-linked facts**, and a **compliance reviewer agent** checks for **missing CDD steps**, **PII handling**, and **tipping-off** risks—under **human AML officer** ownership for filings and escalations. This is **not** legal advice; jurisdictional processes vary.

---

## 🎯 Problem
AML teams face huge alert backlogs; single LLM chats mix evidence with speculation. Investigations need **traceable artifacts**, **role separation**, and **workflow** for approvals and regulatory retention.

---

## 💡 Why This Matters
- **Pain it removes:** Slow case closure, inconsistent narratives, and weak auditability during exams.
- **Who benefits:** Banks, neobanks, crypto exchanges (where regulated), and payment platforms with BSA/AML programs (region-specific).

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Multi-Agent

Split **signal detection** from **narrative drafting** from **quality control**, coordinated by supervisor workflows with immutable evidence pointers.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. AML platforms require **tamper-evident logs**, **strict access controls**, **data minimization**, **model governance**, and **operational maturity** for production financial crime programs.

---

## 🏭 Industry
Example:
- Fintech (AML/KYC operations, transaction monitoring, case management)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (internal procedures, typologies—access controlled)
- Planning — **in scope** (investigation plan steps)
- Reasoning — bounded (hypothesis ranking with uncertainty)
- Automation — bounded (prefill case sections—not autonomous SAR filing)
- Decision making — bounded (recommend escalate/close; human decides)
- Observability — **in scope**
- Personalization — limited (per-institution typology packs)
- Multimodal — optional (document exhibits via controlled viewers)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** (case lifecycle, approvals, retention timers)
- **Postgres** (cases, entities, evidence graph metadata)
- **Graph DB** optional (Neo4j) for relationship queries
- **OpenAI Agents SDK** (multi-agent with tool isolation)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Alerts from TM system, analyst console, supervisor approvals.
- **LLM layer:** Multi-agent analysis with tools for queries over **approved** data subsets.
- **Tools / APIs:** Transaction search, counterparties, KYC record summaries (redacted), sanctions rescreen, case export.
- **Memory (if any):** Case timeline; typology retrieval; prior similar cases (governed).
- **Output:** Structured case package, disposition codes, optional SAR worksheet drafts for human edit.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Case management UI + manual notes; no LLM.

### Step 2: Add AI layer
- LLM drafts bullet list from analyst-selected transaction IDs only.

### Step 3: Add tools
- Add query tools returning JSON with row limits and mandatory filters.

### Step 4: Add memory or context
- Index typologies and playbooks with RBAC and audit on access.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Add detector vs analyst vs reviewer agents with separate scopes and escalation paths.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human adjudication of draft narrative factual errors on labeled cases.
- **Latency:** Time to first useful case outline from alert intake.
- **Cost:** Tokens + compute per case at backlog volumes.
- **User satisfaction:** Analyst NPS, time-to-disposition improvements.
- **Failure rate:** Factual errors in narratives, tipping-off language, access violations, missed critical links.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented counterparties; mitigated by evidence IDs only, no free-text facts without citations.
- **Tool failures:** Query timeouts on huge graphs; mitigated by pagination, budgets, and sampled subgraphs with explicit limits.
- **Latency issues:** Long agent chains; mitigated by parallel tool gathers and summarization tiers.
- **Cost spikes:** Re-querying entire history per token; mitigated by case-scoped materialized subgraphs.
- **Incorrect decisions:** Biased suspicion patterns; mitigated by fairness monitoring, peer review, and periodic model/rule validation—not prompt tweaks as primary control.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit; classify logs; strict RBAC; break-glass procedures.
- **Observability:** Case queue SLA, tool error rates, agent refusal triggers, data access anomalies.
- **Rate limiting:** Per analyst session; detect unusual bulk exports.
- **Retry strategies:** Safe retries for read queries; no duplicate SAR submissions; human confirmation gates.
- **Guardrails and validation:** Tipping-off language filters; PII redaction modes; jurisdiction-specific export formats.
- **Security considerations:** Zero-trust internal access, encryption, DLP on exports, regular access reviews, exam readiness packs.

---

## 🚀 Possible Extensions

- **Add UI:** Graph explorer with evidence pinning to narrative paragraphs.
- **Convert to SaaS:** Multi-tenant with strong isolation and regional data residency.
- **Add multi-agent collaboration:** Sanctions specialist agent with narrower tool scope.
- **Add real-time capabilities:** Streaming alert enrichment (careful latency vs accuracy).
- **Integrate with external systems:** Actimize-style TM, Quantexa-style graph platforms, regulator portals (where APIs exist).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **human-written** narratives assisted by retrieval; expand automation only with measurement.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Evidence-first** financial crime narratives
  - **Multi-agent** separation for safer drafting
  - **Regulatory** retention and access patterns
  - **System design thinking** for high-stakes compliance tooling
