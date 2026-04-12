System Type: Workflow  
Complexity: Level 2  
Industry: HR  
Capabilities: Matching  

# Resume Screening & Ranking System

## 🧠 Overview
**Deterministic-first workflow** that parses resumes/CVs, extracts **skills + tenure + education**, scores **job-fit** with a **transparent rubric**, and ranks candidates for **recruiter review**—optional LLM assists **normalization** (titles, skills synonyms) but **does not** auto-reject without policy; **bias monitoring** and **audit logs** are required for fair hiring programs.

---

## 🎯 Problem
High-volume reqs bury strong candidates; ad-hoc keyword matching is noisy and hard to defend in audits.

---

## 💡 Why This Matters
- **Pain it removes:** Slow screening, inconsistent bar, and weak explainability to hiring managers.
- **Who benefits:** Talent teams distinct from **parse-heavy** pipelines (see also `ai-resume-parsing-ranking-system` for hybrid doc→agent flows).

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Ingest → parse → score → queue is orchestration; LLM is optional **normalization** micro-step with validation.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Rubric scoring + workflow SLAs; L3+ adds richer embeddings and calibrated models with legal review.

---

## 🏭 Industry
Example:
- HR / recruiting operations

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — job description variants, rubric docs
- Planning — bounded (batch review waves)
- Reasoning — optional explanation snippets from structured features only
- Automation — ATS stage transitions (human-gated)
- Decision making — bounded (rank ordering, not final hire)
- Observability — **in scope**
- Personalization — per-req weight profiles
- Multimodal — PDF/DOCX parsing (layout-aware)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Temporal** / **Inngest**, **Node.js + TypeScript**
- **pdf.js** / vendor parsers, **Postgres**
- Optional **OpenAI SDK** for normalization with **Zod** validation
- **Greenhouse/Lever/Workday** APIs (scoped)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Application ingest, req id, compliance region.
- **LLM layer:** Optional title/skill normalization to canonical taxonomy.
- **Tools / APIs:** ATS fetch/upload, parser microservice, rubric config service.
- **Memory (if any):** Feature store per candidate+req; model version registry.
- **Output:** Ranked list + score breakdown for recruiter UI.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Keyword score only + CSV export.

### Step 2: Add AI layer
- LLM maps free-text skills to taxonomy with confidence thresholds.

### Step 3: Add tools
- ATS integration; redact PII fields disallowed in model calls per policy.

### Step 4: Add memory or context
- Track human override reasons to improve rubric weights (governed).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional interviewer-prep agent separate from ranking (different trust boundary).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Agreement with blind human rankings on labeled sets; adverse impact monitoring.
- **Latency:** p95 time from apply to ranked queue.
- **Cost:** Parse + optional LLM $ per applicant.
- **User satisfaction:** Recruiter time saved; hiring manager trust.
- **Failure rate:** Parser misses, demographic proxies leaking into features, ATS sync bugs.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented employers; validate against parsed text spans only.
- **Tool failures:** OCR garbage; route to manual review bucket.
- **Latency issues:** Huge PDFs; async parse with progress UI.
- **Cost spikes:** Re-scoring entire DB nightly; incremental on new applies only.
- **Incorrect decisions:** Auto-reject of protected classes via proxies; feature audits and legal sign-off.

---

## 🏭 Production Considerations

- **Logging and tracing:** Score version, rubric id, redaction pipeline stats—minimize raw resume retention.
- **Observability:** Stage conversion funnel, override rates, parser error taxonomy.
- **Rate limiting:** Per req and per org; abuse detection on bulk uploads.
- **Retry strategies:** Idempotent ATS writes with external keys.
- **Guardrails and validation:** EEOC/GDPR-aware data handling; regional rules for automated decisions.
- **Security considerations:** Encryption, access logging, DSAR deletion hooks, vendor DPAs.

---

## 🚀 Possible Extensions

- **Add UI:** Score explainer with evidence chips from resume text.
- **Convert to SaaS:** Multi-tenant screening with per-customer rubrics.
- **Add multi-agent collaboration:** Separate compliance checker on outputs only.
- **Add real-time capabilities:** Slack alerts for top-decile candidates.
- **Integrate with external systems:** HackerRank, Codility for skills verification (separate stage).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **auditability + fairness metrics** before any auto-advance to interview.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Responsible** hiring automation
  - **Rubric-first** ranking systems
  - **ATS integration** realities
  - **System design thinking** for HR tech compliance
