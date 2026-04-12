System Type: Agent  
Complexity: Level 3  
Industry: Lifestyle / Events  
Capabilities: Planning  

# Event Catering Planning System

## 🧠 Overview
Helps hosts plan **catering-scale food** for birthdays, weddings, or company offsites: **headcount-based quantities**, **menu themes**, **dietary coverage**, and **shortlisted vendors** with **rough budget bands**—grounded in **user headcount**, **service style** (buffet vs plated), and **vendor directory tools** (not invented prices).

---

## 🎯 Problem
Quantity spreadsheets are error-prone; dietary coverage is uneven; comparing caterers is apples-to-oranges without a structured brief.

---

## 💡 Why This Matters
- **Pain it removes:** Waste, shortages, and last-minute catering scrambles.
- **Who benefits:** Small business admins, wedding planners, and busy parents.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **multi-step tool plan** (calculator, vendor search, checklist generator); durable reminders via **workflow**.

---

## ⚙️ Complexity Level
**Target:** Level 3 — structured planning + external data + guardrails.

---

## 🏭 Industry
Lifestyle / small events

---

## 🧩 Capabilities
Planning, Optimization, Retrieval, Personalization, Automation

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres events, OpenAI SDK tools, spreadsheet export (CSV), Google Places / Yelp for caterers (licensed), Temporal for reminders, OpenTelemetry

---

## 🧱 High-Level Architecture
Intake form → **Catering Agent** computes portions + menu skeleton → vendor query → RFP-style brief PDF → host edits → optional “request quote” email templates

---

## 🔄 Implementation Steps
1. Static portion multipliers per item type  
2. Add dietary tags and minimum vegetarian %  
3. Vendor shortlist with distance + rating filters  
4. Budget sensitivity sliders (low/med/high)  
5. Day-of timeline (drop-off vs full service)  

---

## 📊 Evaluation
Host-reported “ran out of food” incidents (target ~0), leftover mass proxy, quote response rate when using generated briefs

---

## ⚠️ Challenges & Failure Cases
**Underestimating teens vs adults**; stale vendor availability; hallucinated menu items—segment multipliers from tool tables, show assumptions explicitly, require vendor IDs from search tool

---

## 🏭 Production Considerations
Food safety disclaimers, allergen “cannot guarantee” language, regional liquor laws if suggesting bar packages

---

## 🚀 Possible Extensions
RSVP-linked auto-adjust quantities T-48h before event

---

## 🔁 Evolution Path
PDF templates → agent-filled briefs → vendor API integrations where partners exist

---

## 🤖 Agent breakdown
- **Step planner:** chooses sequence (headcount → dietary mix → menu → quantities → vendors).  
- **Quantity engine (tool):** deterministic math from catering rules table (editable).  
- **Copywriter sub-pass:** turns structured plan into host-facing narrative + shopping list.

---

## 🎓 What You Learn
Structured event planning, hybrid deterministic + LLM UX, responsible vendor discovery
