System Type: Workflow  
Complexity: Level 2  
Industry: Customer Support  
Capabilities: Generation  

# Knowledge Base Auto-Curation System

## 🧠 Overview
**Workflows** that turn **resolved tickets** into **draft KB articles** with **title/outline/body**, **linked macros**, and **review queues**—deterministic templates extract **steps and error codes**; optional LLM **polishes prose** under **style constraints**. Nothing publishes without **human approval** and **link check** validation.

---

## 🎯 Problem
Support teams solve the same issues repeatedly because documentation lags; manual KB writing is slow and inconsistent.

---

## 💡 Why This Matters
- **Pain it removes:** Stale help centers, contradictory articles, and slow onboarding for new agents.
- **Who benefits:** CX ops, technical writers, and customers self-serving on web portals.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Resolutions → extract → draft → review → publish is a **pipeline** with SLAs and audit.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Extraction + templating + review UI; L3+ adds dedupe against existing articles via embeddings and multi-language generation.

---

## 🏭 Industry
Example:
- Customer support / technical communications

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — similar existing articles for dedupe
- Planning — bounded (article outline)
- Reasoning — optional clarity pass
- Automation — **in scope** (draft creation)
- Decision making — bounded (publish/no-publish gates)
- Observability — **in scope**
- Personalization — per-product doc templates
- Multimodal — optional screenshots sanitized from tickets

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Temporal** / **Inngest** for review SLAs
- **Node.js + TypeScript** workers
- **OpenAI SDK** for drafting under schema
- **CMS/KB API** (Notion, Git-based docs, Zendesk Guide)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Ticket resolved events, labels marking “kb-candidate”.
- **LLM layer:** Draft generator with strict section schema + disclaimers.
- **Tools / APIs:** Ticket fetch, link validator, image scrubber, CMS publish API.
- **Memory (if any):** Dedupe index of article embeddings.
- **Output:** Draft records + reviewer assignments.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Copy-paste template from ticket fields only.

### Step 2: Add AI layer
- LLM rewrites steps for clarity with forbidden-phrase list.

### Step 3: Add tools
- Auto-check links and command snippets against allowlist.

### Step 4: Add memory or context
- Retrieve nearest KB articles to merge duplicates instead of forking.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional editor agent vs fact-checker agent with merge rules.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Defect rate on published articles (reopened tickets citing doc wrong).
- **Latency:** Time from resolution to draft ready for review.
- **Cost:** LLM $ per draft; reviewer minutes saved vs fully manual.
- **User satisfaction:** Self-serve deflection rate; CSAT on help articles.
- **Failure rate:** PII leakage, unsafe commands, broken screenshots.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented menu paths; require citations to ticket/tool-grounded facts.
- **Tool failures:** CMS API errors; keep draft queued with retry.
- **Latency issues:** Huge threads; summarize with chunking before draft.
- **Cost spikes:** Auto-run on every ticket; strict candidate filters.
- **Incorrect decisions:** Publishing secrets or customer-specific data; redaction pipeline mandatory.

---

## 🏭 Production Considerations

- **Logging and tracing:** Draft ids, reviewer actions, publish versions.
- **Observability:** Review backlog age, rejection reasons taxonomy, deflection metrics.
- **Rate limiting:** Per-brand draft creation; detect abusive exfil via ticket text.
- **Retry strategies:** Idempotent publish with content hashes.
- **Guardrails and validation:** Legal disclaimers for regulated products; versioned rollback.
- **Security considerations:** PII scrubbing, RBAC for drafts, audit for public URL changes.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side ticket vs article with highlight mapping.
- **Convert to SaaS:** KB autopilot for MSPs.
- **Add multi-agent collaboration:** Translator + accessibility checker chain.
- **Add real-time capabilities:** Suggest KB insert links to agents during live chat.
- **Integrate with external systems:** Algolia DocSearch, Salesforce Knowledge.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **review + redaction** quality before auto-publish pilots.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Ticket-to-doc** pipelines
  - **Human-in-the-loop** publishing
  - **Dedupe** with embeddings
  - **System design thinking** for self-serve support content
