System Type: Multi-Agent  
Complexity: Level 3  
Industry: Lifestyle  
Capabilities: Decision making  

# Group Restaurant Decision Agent

## 🧠 Overview
Helps a **friend group or team** pick where to eat when everyone has **different diets, budgets, and distance tolerance**. A **short-lived multi-agent session** collects structured preferences, scores venues from **maps/reviews APIs**, and returns a **ranked shortlist** with **tradeoff explanations**—no single “magic prompt”; the flow is **multi-step** with **human final vote**.

---

## 🎯 Problem
Group chats spiral (“I’m fine with anything” → then vetoes). Manual polling is slow and ignores constraints like **gluten-free**, **halal**, or **$15 caps**.

---

## 💡 Why This Matters
- **Pain it removes:** Decision fatigue and last-minute “we missed the reservation” moments.
- **Who benefits:** Office lunch crews, travel groups, and family weekend planners.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — separate concerns for **preference intake**, **venue retrieval**, and **consensus scoring** coordinated by a **facilitator** with a fixed turn budget.

---

## ⚙️ Complexity Level
**Target:** Level 3 — tool-backed search, constraint solving, and session state.

---

## 🏭 Industry
Lifestyle / consumer social

---

## 🧩 Capabilities
Decision making, Planning, Personalization, Retrieval, Automation

---

## 🛠️ Suggested TypeScript Stack
Next.js or Expo, Node.js BFF, Postgres (sessions + votes), Google Places / Yelp (licensed), Redis rate limits, OpenAI Agents SDK, OpenTelemetry

---

## 🧱 High-Level Architecture
Create session → invite links → parallel preference forms → **Facilitator** merges constraints → **Venue Agent** queries APIs → **Scoring Agent** ranks → push shortlist → optional calendar hold

---

## 🔄 Implementation Steps
1. Manual ranked list from static JSON venues  
2. Add Places search within bounding box  
3. Add per-person veto tags and hard filters  
4. Multi-agent scoring with explainable feature vector  
5. Reservation deep links + “split bill later” handoff  

---

## 📊 Evaluation
Time-to-shortlist, % sessions reaching a pick, NDCG vs post-hoc group satisfaction survey, API cost per session

---

## ⚠️ Challenges & Failure Cases
Stale hours/closed venues; **biased review summaries**; one person dominating—freshness TTL on results, cite review counts, facilitator caps talkative agents, show **why** a venue dropped out

---

## 🏭 Production Considerations
OAuth for maps providers, abuse prevention on public invite links, GDPR deletion for session transcripts, tos-compliant data use

---

## 🚀 Possible Extensions
Recurring “Tues lunch club” memory with rotating fairness (who picked last time)

---

## 🔁 Evolution Path
Form-only → single agent ranker → multi-agent facilitator → org SSO + expense integration

---

## 🤖 Agent breakdown
- **Facilitator agent:** owns session state, turn order, and merge rules; never calls maps directly.  
- **Preference normalizer agent:** converts messy free-text into typed constraints (diet, price, distance).  
- **Venue retrieval agent:** calls Places/search tools with hard filters (open now, rating floor).  
- **Consensus scorer agent:** combines utilities; outputs ranked list + dissent notes for outliers.

---

## 🎓 What You Learn
Small-group decision systems, constraint-aware retrieval, multi-agent facilitation without runaway autonomy
