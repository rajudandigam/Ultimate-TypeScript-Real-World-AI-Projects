System Type: Multi-Agent  
Complexity: Level 4  
Industry: AI Core / Research  
Capabilities: Research  

# Autonomous Research Multi-Agent System

## 🧠 Overview
A **multi-agent research stack** that **plans investigations**, **retrieves sources** (web + internal corpora when connected), **critiques evidence**, and **synthesizes** a **cited brief**—with **budgets**, **stop rules**, and **adversarial critique** to reduce **confident fiction**.

---

## 🎯 Problem
Single-shot LLM “research” hallucinates citations; long tasks lose thread; unsafe browsing risks.

---

## 💡 Why This Matters
- **Pain it removes:** Manual tab hoarding for competitive intel, due diligence, and technical deep dives.
- **Who benefits:** Analysts, PMs, and engineers exploring unfamiliar domains quickly.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Planner**, **Retriever**, **Analyst**, **Critic**, optional **Fact-checker** with a supervisor.

---

## ⚙️ Complexity Level
**Target:** Level 4 — orchestration, tool governance, and evaluation harnesses.

---

## 🏭 Industry
Research / knowledge work

---

## 🧩 Capabilities
Research, Retrieval, Reasoning, Planning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI Agents SDK, Tavily/Bing APIs (with keys), internal RAG connector, Playwright fetcher in sandbox, Postgres trace store, OpenTelemetry

---

## 🧱 High-Level Architecture
Question → plan graph → parallel retrieve → note cards → critic pass → synthesis with citations → export (Markdown/PDF)

---

## 🔄 Implementation Steps
1. Fixed pipeline (no autonomy)  
2. Add planner with max depth  
3. Critic agent blocks unsupported claims  
4. Human review queue for high-risk topics  
5. Continuous eval on golden questions  

---

## 📊 Evaluation
Citation support rate (human verified), nugget recall vs gold summaries, average tool calls, unsafe URL fetch rate (should be ~0)

---

## ⚠️ Challenges & Failure Cases
**Circular citations**; paywalled content mis-summarized; **prompt injection** in web pages—fetch sandboxes, allowlisted domains, snapshot hashing, critic must flag “no source”

---

## 🏭 Production Considerations
Copyright respect, robots.txt compliance, PII redaction, per-tenant web access policies, cost ceilings

---

## 🚀 Possible Extensions
Team workspaces where humans pin “trusted sources” per project

---

## 🔁 Evolution Path
Manual prompts → tool-using researcher → supervised multi-agent → governed research API product

---

## 🎓 What You Learn
Evidence-based synthesis, multi-agent debate patterns, web automation safety
