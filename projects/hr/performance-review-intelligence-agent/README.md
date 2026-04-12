System Type: Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Analysis  

# Performance Review Intelligence Agent

## 🧠 Overview
Helps managers draft **fair, evidence-based** review narratives by pulling **goals, project artifacts, peer feedback summaries** (where policy allows) via tools—outputs highlight **strengths, gaps, growth paths** as **draft text** with **source citations**; **not** auto-submitting ratings or **bypassing** calibration sessions. **Bias and privacy** controls are mandatory.

---

## 🎯 Problem
Review cycles compress into low-quality text; managers forget accomplishments; calibration lacks shared evidence language.

---

## 💡 Why This Matters
- **Pain it removes:** Blank-page manager stress, inconsistent feedback quality, and weak development plans.
- **Who benefits:** People managers and HRBPs in mid-to-large orgs.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using). `fetch_goals`, `fetch_ship_log`, `fetch_feedback_agg`, `draft_sections`.

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-source synthesis + structured review schema; L4+ adds calibration copilot with org-wide analytics (heavily governed).

---

## 🏭 Industry
HR / performance management

---

## 🧩 Capabilities
Retrieval, Reasoning, Planning, Observability, Personalization (role-aware)

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK, Workday/Lattice/Culture Amp APIs (read), internal git/PM summaries (scoped), Postgres, OpenTelemetry

---

## 🧱 High-Level Architecture
Manager console → agent with read-only HR tools → structured draft → manager edits → HRIS export (manual or gated automation)

---

## 🔄 Implementation Steps
Template-only drafts → add goal fetch → add aggregated 360 text with redaction → citation-required narrative → calibration helper mode (read-only suggestions)

---

## 📊 Evaluation
Manager time saved, perceived fairness surveys, HRBP edit distance, incident rate of inappropriate content (target 0)

---

## ⚠️ Challenges & Failure Cases
Hallucinated achievements; leaking peer identity; demographic bias in language; storing sensitive text insecurely; overriding calibration outcomes—mitigate with citations, aggregation rules, style/fairness lint, encryption, explicit non-authority for ratings

---

## 🏭 Production Considerations
Least-privilege reads, retention windows, legal hold, union context rules, accessibility of generated HTML, audit of who generated what for which employee

---

## 🚀 Possible Extensions
Growth plan suggestions tied to internal learning catalog IDs only

---

## 🔁 Evolution Path
Templates → tool-backed drafting → calibration analytics assist → multi-agent with strict separation of duties

---

## 🎓 What You Learn
Performance cycle tooling, evidence-based people analytics UX, HRIS integration safety
