System Type: Agent  
Complexity: Level 3  
Industry: Personal / Career  
Capabilities: Personalization, Planning  

# Personalized Career Pivot Coach

## 🧠 Overview
Helps knowledge workers **map skills → adjacent roles**, build a **credible narrative**, and produce a **learning roadmap** (courses, certs, portfolio projects) using **resume + public profile imports** (user-authorized) and **labor market signals** (ONS/BLS or licensed APIs)—**not** a replacement for coaches or recruiters; **no guaranteed outcomes**; flags **sensitive bias** risks in suggestions.

---

## 🎯 Problem
Pivoting feels opaque; people undersell transferable skills; generic advice ignores local market and visa constraints.

---

## 💡 Why This Matters
- **Pain it removes:** Paralysis and mismatched upskilling spend.
- **Who benefits:** Mid-career tech workers, returning parents, and laid-off cohorts with agency consent flows.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **structured tools** (skills taxonomy lookup, job posting retrieval, course catalog APIs) and **memory** scoped to user vault with export/delete.

---

## ⚙️ Complexity Level
**Target:** Level 3 — personalization + retrieval + guardrails.

---

## 🏭 Industry
Career / edtech-adjacent

---

## 🧩 Capabilities
Personalization, Planning, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres + pgvector for user doc chunks, OpenAI SDK, Lightcast/Adzuna APIs (examples), OAuth for LinkedIn import (scoped), OpenTelemetry

---

## 🧱 High-Level Architecture
Consent + data import → **normalize skills graph** → **Coach Agent** proposes role adjacency matrix → user picks target → generates 90-day plan with milestones → calendar export + progress nudges

---

## 🔄 Implementation Steps
1. Resume parse to structured skills only  
2. Market demand overlay by metro  
3. Visa-sensitive wording mode (informational, not legal advice)  
4. Portfolio project generator tied to GitHub template repos  
5. Weekly retro prompts to update plan  

---

## 📊 Evaluation
User-reported interview rate lift (self), plan completion %, harmful suggestion reports (target ~0), churn reasons taxonomy

---

## ⚠️ Failure Scenarios
**Stale postings** drive bad targets; **stereotyped role suggestions**; overpromising salary—date-stamped market data, fairness review set, show confidence intervals, “consult a licensed advisor” for immigration/legal

---

## 🤖 Agent breakdown
- **Profiler tool:** extracts skills/projects with provenance spans.  
- **Market tool:** pulls posting stats with API timestamps.  
- **Coach agent:** composes adjacency paths and learning steps with citations to postings/docs.  
- **Guardrail pass:** blocks discriminatory language and checks for disallowed sensitive inference.

---

## 🎓 What You Learn
Consent-first personal data products, labor market grounding, responsible coaching UX
