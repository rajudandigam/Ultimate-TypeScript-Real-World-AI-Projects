System Type: Multi-Agent  
Complexity: Level 3  
Industry: Lifestyle / Events  
Capabilities: Coordination  

# Potluck Coordination Agent

## 🧠 Overview
Coordinates **who brings what** for a potluck so the **menu balances** (protein, veg, dessert), **avoids duplicate mains**, and respects **allergies** and **kitchen capacity** (two ovens, one fridge shelf). Uses **short-lived multi-agent roles** to propose assignments, detect conflicts, and negotiate swaps—hosts approve the final roster.

---

## 🎯 Problem
Shared spreadsheets go stale; people double-book mac and cheese; allergens get lost in chat scrollback.

---

## 💡 Why This Matters
- **Pain it removes:** Awkward last-minute runs to the store and unsafe food surprises.
- **Who benefits:** Hosts, office party planners, and school event volunteers.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Menu architect**, **Assignment agent**, and **Conflict mediator** with a **host supervisor** budget.

---

## ⚙️ Complexity Level
**Target:** Level 3 — constraint satisfaction with human override.

---

## 🏭 Industry
Lifestyle / social coordination

---

## 🧩 Capabilities
Coordination, Planning, Decision making, Automation, Personalization

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres (event + RSVPs), Redis locks, OpenAI Agents SDK, email/SMS via Resend/Twilio, OpenTelemetry

---

## 🧱 High-Level Architecture
Create event → guests submit dish intents + constraints → agents propose slotting → host edits → lock roster → reminder cron before event

---

## 🔄 Implementation Steps
1. Static category slots (appetizer/main/side/dessert)  
2. Duplicate detection on dish embeddings + exact text  
3. Allergen tagging with required acknowledgments  
4. Swap negotiation chat with mediator agent  
5. Print-friendly shopping quantities for shared items  

---

## 📊 Evaluation
% balanced menus achieved, duplicate rate post-lock, host edit count, guest satisfaction quick-poll

---

## ⚠️ Challenges & Failure Cases
Guests ghost RSVPs; **conflicting allergy** (nuts vs may contain); mediator suggests culturally insensitive pairings—deadline escalation, explicit allergen matrix, tone/style guidelines in mediator prompts

---

## 🏭 Production Considerations
PII minimization, child events require guardian consent mode, spam prevention on public invite links

---

## 🚀 Possible Extensions
Store-circular integration for “host buys bulk drinks” line items

---

## 🔁 Evolution Path
Spreadsheet template → single-agent suggestions → multi-agent negotiation → recurring club events with fairness memory

---

## 🤖 Agent breakdown
- **Menu architect agent:** proposes target counts per category from headcount + duration.  
- **Assignment agent:** maps people → slots using preferences and equipment notes.  
- **Mediator agent:** resolves collisions (“two lasagnas”) with swap offers and host-friendly rationale.

---

## 🎓 What You Learn
Constraint-heavy coordination UX, small multi-agent negotiation, event-driven reminders
