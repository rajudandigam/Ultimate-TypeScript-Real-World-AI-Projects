System Type: Agent  
Complexity: Level 3  
Industry: Agentic UI  
Capabilities: Automation  

# AI Form Filling Assistant

## 🧠 Overview
An **in-form assistant** that maps **natural language or pasted blobs** (resume text, company address) into **structured field values** using **schema-aware** extraction, runs **validation** against your Zod/OpenAPI rules, and only commits when the **host app** accepts—avoiding “the model filled hidden admin fields” class incidents.

---

## 🎯 Problem
Long forms abandon users; copy-paste across tabs introduces errors. Generic autofill ignores custom validators. You need **field-level provenance**, **accessibility** (labels, errors), and **compliance** (PII minimization).

---

## 💡 Why This Matters
- **Pain it removes:** Registration friction, B2B onboarding forms, and internal ops tickets with inconsistent data entry.
- **Who benefits:** SaaS onboarding teams, insurance/real-estate style long forms (with legal review), HR intake UIs.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Form filling is a tight loop: **parse → propose → validate → apply patch**. One agent keeps UX coherent.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Adds **session memory** of partial fills and optional **RAG** over help text; L4+ would add multi-step wizards across sections with stronger policy engines.

---

## 🏭 Industry
Example:
- Agentic UI (smart forms, onboarding, data entry copilots)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (field help, glossary)
- Planning — light (ordered section fill)
- Reasoning — bounded (resolve ambiguous mappings)
- Automation — **in scope** (batch field proposals)
- Decision making — bounded (confidence gating per field)
- Observability — **in scope**
- Personalization — optional (remember safe defaults per org role)
- Multimodal — optional (image of ID → OCR pipeline, not raw vision in prod without review)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **React Hook Form** + **Zod**
- **Node.js + TypeScript** BFF
- **OpenAI SDK** (structured outputs → `Partial<FormModel>`)
- **Postgres** optional for saved drafts
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Field schema JSON, user text, optional file extracts.
- **LLM layer:** Agent outputs **field patches** with confidence and source span references when applicable.
- **Tools / APIs:** `validate_patch`, `lookup_postal`, org directory search (scoped).
- **Memory (if any):** Draft autosave keyed by session; no cross-user leakage.
- **Output:** Staged values in client state; inline validation errors from host validators.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Per-field templates and regex; no LLM.

### Step 2: Add AI layer
- LLM maps paste text to JSON; Zod rejects invalid proposals.

### Step 3: Add tools
- Add async enrichment tools (address verification, company registry).

### Step 4: Add memory or context
- Remember last corrections user made to improve next suggestions.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist for tax/legal sections with read-only corpus (jurisdiction dependent).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Field-level precision/recall vs human labels on sample forms.
- **Latency:** p95 time to propose full section under typical paste sizes.
- **Cost:** Tokens per completed application.
- **User satisfaction:** Completion rate uplift, time-on-task reduction.
- **Failure rate:** Validator rejects after fill, wrong sensitive field population, accessibility regressions.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Fabricated invoice numbers; mitigated by checksum tools and “unknown” allowed states.
- **Tool failures:** Address API down; mitigated by partial save + user override path.
- **Latency issues:** Huge pasted PDFs; mitigated by chunking, background extraction, progress UI.
- **Cost spikes:** Re-embedding entire policy PDF each keystroke; mitigated by debounce and doc hashing.
- **Incorrect decisions:** Filling SSN into wrong field; mitigated by field sensitivity tiers, masking UI, and never auto-submitting hidden fields.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log field keys touched, not values for sensitive fields; audit who approved imports.
- **Observability:** Rejection reasons histogram, tool latency, model confidence calibration drift.
- **Rate limiting:** Per session uploads; antivirus scan on files.
- **Retry strategies:** Idempotent draft saves; safe merge rules for concurrent edits.
- **Guardrails and validation:** Server-side Zod is final authority; block patches to read-only fields from client hints.
- **Security considerations:** CSRF, XSS in rendered suggestions, PII retention limits, regional privacy compliance.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side “source snippet → field” provenance UI.
- **Convert to SaaS:** Embeddable widget SDK for third-party sites.
- **Add multi-agent collaboration:** Separate PII redactor pass before model sees text (privacy).
- **Add real-time capabilities:** Collaborative multi-user form fill with presence.
- **Integrate with external systems:** HRIS, CRM, government eligibility APIs (licensed).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **non-sensitive** sections; expand only with security review.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Schema-first** LLM outputs
  - **Client vs server validation** boundaries
  - **Provenance** UX for autofill
  - **System design thinking** for trustworthy data entry
