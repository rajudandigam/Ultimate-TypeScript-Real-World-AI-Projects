# Project Name

> Add metadata lines at the top of each catalog `README.md` (match existing projects):
>
> `System Type:` …  
> `Complexity:` …  
> `Industry:` …  
> `Capabilities:` …

## 🧠 Overview
One or two sentences explaining what this system does in simple terms.

---

## 🎯 Problem
What real-world problem does this solve?

Explain in a practical, relatable way. Avoid generic AI language.

---

## 💡 Why This Matters
Why is this problem important in real systems?

- What pain does it remove?
- Who benefits from this?

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

Explain briefly why this system type is appropriate.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

---

## 🏭 Industry
Example:
- DevTools / Travel / Fintech / Healthcare / E-commerce / etc.

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG)
- Planning
- Reasoning
- Automation
- Decision making
- Observability
- Personalization
- Multimodal

---

## 🛠️ Suggested TypeScript Stack
Project-specific bullets (libraries, hosts, datastores). Keep this aligned with the **Recommended Stack** section below.

---

### Recommended Stack
After the initial catalog pass, run `python3 scripts/enrich_project_docs.py` from the repo root, or author manually:

- frontend or API framework (1-line why)
- agent / workflow framework (1-line why)
- model SDK
- storage
- observability
- deployment

### Suggested APIs and Integrations
Only integrations that fit this domain (Stripe, GitHub, Gmail, FHIR, SIEM, etc.).

### Open Source Building Blocks
Tailored OSS (LangChain.js, Temporal, n8n, MCP, pgvector, …) — not a generic dump.

### Stack Choice Guide
- **Best default stack**
- **Lightweight alternative**
- **Production-heavy alternative**

### Buildability Notes
- weekend-first slice
- defer-to-production items
- optional vs essential components

---

## 🧱 High-Level Architecture
Describe the main components:

- Input (UI / API / CLI)
- LLM layer
- Tools / APIs
- Memory (if any)
- Output

---

## 🔄 Implementation Steps

### Step 1: Basic version
### Step 2: Add AI layer
### Step 3: Add tools
### Step 4: Add memory or context
### Step 5: Upgrade to agent or multi-agent (if applicable)

---

## 📊 Evaluation
How do you measure if this system works?

---

## ⚠️ Challenges & Failure Cases

---

## 🏭 Production Considerations

---

## 🚀 Possible Extensions

---

## 🔁 Evolution Path

---

## 🎓 What You Learn
