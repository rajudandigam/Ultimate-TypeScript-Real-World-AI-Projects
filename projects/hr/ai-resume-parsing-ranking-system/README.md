System Type: Workflow → Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Extraction, Ranking  

# AI Resume Parsing + Ranking System

## 🧠 Overview
A **workflow-backed hiring pipeline** that **extracts** structured candidate profiles from resumes/CVs, **normalizes** skills and titles against a **taxonomy**, and uses an **agent-assisted ranker** to score applicants against a **job rubric**—with **human-in-the-loop** for final decisions, **bias mitigation** checkpoints, and **audit logs** because hiring automation is high-stakes and regulated in many jurisdictions.

---

## 🎯 Problem
Recruiters skim inconsistently; keyword search misses synonyms. Raw LLM ranking introduces **opaque bias** and **fabricated credentials**. You need **structured extraction**, **transparent scoring**, and **appealable** outputs.

---

## 💡 Why This Matters
- **Pain it removes:** Slow screening, inconsistent rubrics, and noisy ATS search.
- **Who benefits:** Growing companies with high inbound volume and structured interview processes.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow → Agent

**Workflow** handles ingest, OCR, dedupe, PII boundaries, and stage gates. **Agent** helps map messy text to schema and **narrates** match rationale tied to **rubric item ids**—not unbounded “this person is better.”

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Extraction + ranking with review loops; L5 adds global compliance (EEOC/GDPR analogues), adversarial testing, and enterprise HCM integrations at scale.

---

## 🏭 Industry
Example:
- HR (recruiting, ATS augmentation, talent acquisition operations)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (job description + rubric snippets)
- Planning — light (pipeline stages)
- Reasoning — bounded (explain rubric matches with citations to resume fields)
- Automation — **in scope** (stage transitions, notifications)
- Decision making — bounded (suggested rank; human approves shortlist)
- Observability — **in scope**
- Personalization — limited (role-specific weights configured by HR, not hidden model drift)
- Multimodal — **in scope** (PDF/DOCX parsing via pipeline, not ad-hoc model file drops)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** / **Inngest**
- **Postgres** (candidates, structured profiles, audit)
- **S3** + OCR/doc parsers
- **OpenAI SDK** (structured extraction + rationale JSON)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Application portal uploads, inbound email attachments, LinkedIn exports (ToS compliant).
- **LLM layer:** Agent maps resume sections to schema; separate scoring step uses rubric weights from DB.
- **Tools / APIs:** `normalize_skill`, `geocode` (careful), calendar scheduling for interviews (optional).
- **Memory (if any):** Prior recruiter corrections to taxonomy mappings (approved).
- **Output:** Ranked list with explainability JSON + human review UI.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual ATS fields; workflow only for notifications.

### Step 2: Add AI layer
- LLM extracts JSON resume schema; hard validators reject incomplete rows.

### Step 3: Add tools
- Add skill ontology tools and synonym tables maintained by HR.

### Step 4: Add memory or context
- Store recruiter overrides as supervised training for classifier head (governed).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **adversarial review** agent that flags potential demographic proxy features (policy-driven).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Field extraction F1; ranking agreement with blinded human panels on sample sets.
- **Latency:** Time from upload to rank for p95 resume sizes.
- **Cost:** $ per applicant at volume.
- **User satisfaction:** Recruiter time saved; candidate experience (time-to-first human touch).
- **Failure rate:** Wrong contact info, discriminatory patterns, duplicate profiles merged incorrectly.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented employers; mitigated by requiring evidence spans or “unknown” states.
- **Tool failures:** OCR garbage on scans; mitigated by quality checks and candidate re-upload prompts.
- **Latency issues:** Long CVs; mitigated by section chunking and parallel extraction.
- **Cost spikes:** Re-running full extraction on every minor edit; mitigated by hashing and incremental updates.
- **Incorrect decisions:** Downranking due to name ethnicity proxies; mitigated by fairness audits, removing risky features, and legal review—not prompt tweaks alone.

---

## 🏭 Production Considerations

- **Logging and tracing:** Minimize sensitive attributes in logs; immutable audit for rank changes.
- **Observability:** Override rates, stage funnel drop-offs, OCR confidence, model version per job req.
- **Rate limiting:** Per org and per IP on public applications; CAPTCHA where needed.
- **Retry strategies:** Idempotent application ids; dedupe email + file hash.
- **Guardrails and validation:** Block automated rejection letters without human approval where required by law/policy.
- **Security considerations:** PII encryption, retention limits, regional data residency, access controls for hiring managers.

---

## 🚀 Possible Extensions

- **Add UI:** Rubric editor with simulation on historical candidates (privacy sandbox).
- **Convert to SaaS:** Multi-tenant ATS augmentation layer.
- **Add multi-agent collaboration:** Separate **sourcing** agent for boolean search strings (read-only).
- **Add real-time capabilities:** Live score updates as recruiters add interview notes (structured).
- **Integrate with external systems:** Greenhouse, Lever, Workday, background check vendors (compliance gated).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **assistive ranking**; avoid auto-reject until legal and fairness review passes.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Structured hiring** data models
  - **Fairness and compliance** awareness in ML products
  - **Human-in-the-loop** gates for consequential decisions
  - **System design thinking** for sensitive HR automation
