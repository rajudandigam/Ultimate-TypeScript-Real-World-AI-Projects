System Type: Agent  
Complexity: Level 2  
Industry: Public Sector  
Capabilities: Reasoning, Compliance  

# Public Benefit Eligibility Agent

## 🧠 Overview
Helps residents **navigate benefits** (SNAP, Medicaid, LIHEAP-style programs—**jurisdiction-specific**) by turning **plain-language situations** into **structured screening answers**, **document checklists**, and **application step guides**—**policy engine** holds rules; the agent **never** auto-approves benefits; all outcomes are **“likely eligible / unclear / likely not”** with **official source links**.

---

## 🎯 Problem
Forms are confusing; call centers are overloaded; misinformation spreads on social media; people abandon applications mid-way.

---

## 💡 Why This Matters
- **Pain it removes:** Access friction and error-driven denials from missing documents.
- **Who benefits:** State/county portals, nonprofits, and community navigators.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over a **versioned rules DSL** compiled from **published eligibility manuals**; LLM only maps user stories to **enum answers** the engine evaluates.

---

## ⚙️ Complexity Level
**Target:** Level 2 — mostly rules + guided UX with bounded LLM use.

---

## 🏭 Industry
Government / civic tech

---

## 🧩 Capabilities
Reasoning, Compliance, Personalization, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres rules packs per county version, OpenAI SDK structured outputs, contentful/CMS for official links, audit log store, OpenTelemetry, WCAG AA UI

---

## 🧱 High-Level Architecture
Intake wizard → normalized answers → **rules engine** decision → **Eligibility Agent** explains in plain language + next steps → handoff to official application deep links

---

## 🔄 Implementation Steps
1. Single program pilot (language-fixed)  
2. Multi-program bundle with cross-effects (income counted once)  
3. Document OCR assist with human confirm  
4. Navigator co-browse mode (session token)  
5. Analytics for drop-off steps without storing raw PII longer than needed  

---

## 📊 Evaluation
Application completion lift vs control, incorrect guidance rate (human audit sample), average time-to-ready-to-apply, support ticket reduction

---

## ⚠️ Challenges & Failure Cases
**Rule drift** when policies change mid-year; **edge cases** (self-employment income); multilingual nuance—versioned rules with publish dates, “we cannot determine” path, human escalation queue, never fabricate program names

---

## 🏭 Production Considerations
Section 508, privacy minimization, consent logging, bias reviews across demographics, partnership with legal for every jurisdiction pack

---

## 🚀 Possible Extensions
SMS reminder flows for renewal windows (opt-in)

---

## 🤖 Agent breakdown
- **Intake parser:** maps free text to structured enums with confidence; low confidence asks clarifying questions.  
- **Rules executor:** deterministic evaluation only.  
- **Explainer agent:** reads engine output JSON + official URLs to produce user-facing steps.

---

## 🎓 What You Learn
Rules+LLM hybrid for high-stakes civic UX, auditability, equitable access patterns
