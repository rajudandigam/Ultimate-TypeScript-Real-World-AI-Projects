System Type: Agent  
Complexity: Level 3  
Industry: Real Estate  
Capabilities: Matching  

# Smart Property Matching System

## 🧠 Overview
Matches **buyers/renters** to **listings** using **structured prefs** (budget, commute, schools, must-haves) + **vector search** over listing text and **hard filters** (beds, HOA, pet policy)—agent explains **why** each match with **citable listing fields**; **Fair Housing** compliance blocks discriminatory user filters and **steering** language.

---

## 🎯 Problem
Portal search UX frustrates users; agents waste time on poor-fit tours; sensitive criteria need careful handling.

---

## 💡 Why This Matters
Better matches increase conversion and satisfaction while reducing compliance risk.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) with **rules engine** for hard constraints.

---

## ⚙️ Complexity Level
**Target:** Level 3. Hybrid retrieval + reranking + explanations; L4+ adds multi-party negotiation agents (governed).

---

## 🏭 Industry
Real estate / portals & brokerages

---

## 🧩 Capabilities
Matching, Retrieval, Personalization, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, pgvector/OpenSearch, MLS RESO APIs, maps APIs (commute isochrones), OpenAI SDK, OpenTelemetry

---

## 🧱 High-Level Architecture
User profile → agent queries listing index + map tools → ranked shortlist + tour itinerary suggestions → CRM handoff

---

## 🔄 Implementation Steps
SQL filters only → add embeddings → add commute tool → add explanation agent → broker review queue for edge cases

---

## 📊 Evaluation
CTR on matches, tour-to-offer rate, fair housing QA pass rate, user complaints, latency p95

---

## ⚠️ Challenges & Failure Cases
Steering on protected classes; wrong school boundaries; stale listings; hallucinated amenities; expensive map API loops—policy filters, source tags, TTLs, rate limits, schema validation

---

## 🏭 Production Considerations
Fair Housing training for prompts, audit of blocked queries, MLS display rules, consent for location data, ADA for UI

---

## 🚀 Possible Extensions
Saved searches with alerts, co-buyer preference merge with conflict UI

---

## 🔁 Evolution Path
Filters → vectors → agent explain → optional negotiation copilots

---

## 🎓 What You Learn
Fair housing aware matching, geospatial constraints, MLS data modeling
