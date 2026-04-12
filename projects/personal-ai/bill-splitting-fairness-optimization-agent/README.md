System Type: Agent  
Complexity: Level 3  
Industry: Personal AI / Social finance  
Capabilities: Optimization  

# Bill Splitting & Fairness Optimization Agent

## 🧠 Overview
Helps roommates, trip groups, or couples split **shared expenses** with **transparent fairness rules** (equal, income-weighted, usage-based, rotation) and **edge cases**: someone paid deposit, **partial attendance**, **currency mix**, or **“I only had salad.”** Outputs a **settlement graph** (who pays whom) minimizing transactions, plus a **human-readable audit**—**math layer is deterministic**; the agent explains and negotiates wording.

---

## 🎯 Problem
Splitwise-style apps still confuse people when rules mix; group trips create 20 tiny Venmos; fairness arguments recur.

---

## 💡 Why This Matters
- **Pain it removes:** Social friction and opaque “you owe me” messages.
- **Who benefits:** Shared households, ski trips, and wedding parties.

---

## 🏗️ System Type
**Chosen:** **Single Agent** orchestrating **ledger tools** (add expense, set rule window) and a **solver** that computes **minimal cash flow** settlements.

---

## ⚙️ Complexity Level
**Target:** Level 3 — optimization + messy human inputs + audit trails.

---

## 🏭 Industry
Personal finance / social

---

## 🧩 Capabilities
Optimization, Decision making, Personalization, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres ledger, FX rates API (mid-market with timestamp), OpenAI SDK for narrative + dispute mediation prompts, Plaid optional (read-only cash flow context, not required), OpenTelemetry

---

## 🧱 High-Level Architecture
Import expenses (CSV/receipts) → tag participants & splits → **Fairness Agent** proposes rule application → solver → settlement sheet → export to Venmo/PayPal request links (manual confirm)

---

## 🔄 Implementation Steps
1. Equal split + single currency  
2. Itemized restaurant splits with shares  
3. Trip “exclude flight payer from dinners” windows  
4. FX with locked rate date per expense  
5. Dispute flow: agent suggests compromise options with ledger diffs  

---

## 📊 Evaluation
Reduction in number of settlement transactions vs naive pairwise, time-to-group-accept, dispute reopen rate

---

## ⚠️ Challenges & Failure Cases
**Rounding drift** causing cent fights; **mis-tagged payer**; agent suggests unfair gendered defaults—integer cent resolution rules, immutable edit log, neutral templates, human lock on rule changes

---

## 🏭 Production Considerations
Not a bank—clear regulatory positioning, optional E2EE for sensitive notes, export for tax prep (user responsibility disclaimer)

---

## 🚀 Possible Extensions
Recurring rent + utilities templates with automatic meter reading photo parse

---

## 🔁 Evolution Path
Spreadsheet → structured ledger → agent-explained settlements → optional bank feed enrichment with strict consent

---

## 🤖 Agent breakdown
- **Classifier pass:** maps messy text (“I got groceries again”) to structured expense rows with confidence.  
- **Policy interpreter:** applies active rule pack for the date range.  
- **Solver tool:** min-cash-flow graph algorithm in TS (deterministic).  
- **Explainer pass:** narrates settlements with per-line citations to ledger IDs.

---

## 🎓 What You Learn
Settlement optimization, audit-first social fintech UX, keeping LLMs away from the money math
