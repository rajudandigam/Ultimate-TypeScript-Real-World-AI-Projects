System Type: Agent  
Complexity: Level 3  
Industry: Legal / Compliance  
Capabilities: Compliance  

# Privacy Impact Assessment Agent

## 🧠 Overview
A **DPIA/PIA copilot** that walks owners through **data processing inventory** questions, pulls **architecture facts** via tools (data stores, subprocessors, retention configs), and drafts **structured assessment sections** with **gap flags**—it is **not** legal advice; outputs require **privacy counsel review** before filing or adoption.

---

## 🎯 Problem
DPIAs are slow, inconsistently documented, and drift from the **actual system** after launch.

---

## 💡 Why This Matters
- **Pain it removes:** Last-minute GDPR/CCPA fire drills, weak subprocessors documentation, and unclear lawful basis narratives.
- **Who benefits:** Privacy engineers, security, and product teams shipping new features with personal data.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Guided questionnaire + tool-grounded facts + templated sections = agent loop with strong schema.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. RAG over internal standards + repo/diagram tools + multi-section doc generation; L4+ adds multi-stakeholder agents (security vs legal) with merge policies.

---

## 🏭 Industry
Example:
- Legal / privacy engineering

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal DPIA templates, RoPA excerpts, policy library
- Planning — bounded (section ordering, follow-up tasks)
- Reasoning — bounded (risk tier suggestions from facts)
- Automation — export to DOCX/PDF with version ids
- Decision making — bounded (gap detection, not legal conclusions)
- Observability — **in scope**
- Personalization — per-jurisdiction addenda (EU vs US state)
- Multimodal — optional architecture diagrams as attachments (human described)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js** wizard UI + **Node.js** BFF
- **OpenAI SDK** structured outputs
- **Postgres** for assessments + approvals
- **GitHub**/**Backstage** read tools for service metadata
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Feature intake form, system ids, data categories.
- **LLM layer:** Agent fills `DPIASection[]` JSON from answers + tool facts.
- **Tools / APIs:** Service catalog, IAM policy exports (read-only), vendor list APIs.
- **Memory (if any):** Prior assessments for similar features (permissioned).
- **Output:** Draft document + open questions list for counsel.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static questionnaire with PDF export only.

### Step 2: Add AI layer
- LLM drafts narrative sections from user-entered tables only.

### Step 3: Add tools
- Pull live subprocessor list and data flow edges from internal graph.

### Step 4: Add memory or context
- Link to Records of Processing (RoPA) entries and reuse wording with versioning.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Security reviewer agent adds threat modeling bullets (still human-reviewed).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Counsel edit distance; defect rate found in later audits.
- **Latency:** Time-to-first draft for a typical feature intake.
- **Cost:** Tokens per assessment; tool API volume.
- **User satisfaction:** PM friction scores; fewer launch blockers.
- **Failure rate:** Wrong lawful basis text, missing transfers, overconfident “low risk.”

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented subprocessors; only list vendors returned by tools or user-confirmed entries.
- **Tool failures:** Incomplete catalog; explicit “unknown—must verify” flags required.
- **Latency issues:** Large IAM dumps; summarize server-side with hashes.
- **Cost spikes:** Chatty clarification loops; cap turns and use forms for bulk facts.
- **Incorrect decisions:** Presenting output as filed legal work; enforce disclaimers and sign-off roles.

---

## 🏭 Production Considerations

- **Logging and tracing:** Assessment ids, model versions, approver identities—minimize personal data in logs.
- **Observability:** Section completion funnel, time with counsel, reopen rates after launch.
- **Rate limiting:** Per org; protect internal metadata APIs from scraping via agent.
- **Retry strategies:** Idempotent saves per assessment version.
- **Guardrails and validation:** Jurisdiction templates; block export if mandatory sections empty.
- **Security considerations:** Access control for sensitive architecture facts, encryption, legal privilege tagging.

---

## 🚀 Possible Extensions

- **Add UI:** Collaborative redlining with counsel comments.
- **Convert to SaaS:** Privacy program platform module.
- **Add multi-agent collaboration:** Regional counsel variants with explicit scope boundaries.
- **Add real-time capabilities:** CI hook warns when code changes invalidate DPIA assumptions.
- **Integrate with external systems:** OneTrust, TrustArc, DataGrail, Vanta.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **structured facts + templates** before free-form legal prose.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **DPIA/PIA** operational patterns
  - **Tool-grounded** compliance docs
  - **Human counsel** gates in regulated writing
  - **System design thinking** for privacy programs
