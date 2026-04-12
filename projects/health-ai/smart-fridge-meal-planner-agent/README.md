System Type: Agent  
Complexity: Level 3  
Industry: Wellness / Home nutrition  
Capabilities: Multimodal, Planning  

# Smart Fridge Meal Planner Agent

## 🧠 Overview
Uses **camera or barcode inventory** (user-initiated, privacy-gated) plus **household preferences** to propose **meals that use what is on hand**, reduce **waste near expiry**, and output **shopping deltas**—**not** medical nutrition therapy unless **licensed partner** workflow; focuses on **practical meal assembly** with **food safety timers** for leftovers.

*Catalog note:* Complements **`Weekly Grocery Optimization Agent`** (list + deals); this project is **inventory-first, fridge-vision, meal assembly**.

---

## 🎯 Problem
Food spoils behind milk cartons; people rebuy what they already have; weeknight decision fatigue defaults to delivery.

---

## 💡 Why This Matters
- **Pain it removes:** Waste, cost, and low-nutrition convenience defaults.
- **Who benefits:** Families and roommates sharing a fridge.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **vision classification tools** (on-device preferred) and **recipe RAG** from licensed sources.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal + inventory graph + safety copy.

---

## 🏭 Industry
Consumer health / home

---

## 🧩 Capabilities
Multimodal, Planning, Personalization, Optimization, Observability

---

## 🛠️ Suggested TypeScript Stack
React Native, on-device TFLite/CoreML classifiers, Node.js BFF, Postgres inventory graph, OpenAI SDK for recipe adaptation, USDA FoodData Central (nutrient hints), OpenTelemetry

---

## 🧱 High-Level Architecture
Fridge scan → item graph with expiry confidence → **Meal Agent** proposes 3 dinners + lunchables → user swaps → exports shopping shortfall list → optional smart oven timer links

---

## 🔄 Implementation Steps
1. Manual inventory entry MVP  
2. Barcode-first with pack size tracking  
3. Camera assist with on-device classification + cloud fallback  
4. Allergy/household profile hard constraints  
5. Leftover chain planning (Sunday roast → Monday tacos)  

---

## 📊 Evaluation
Self-reported waste reduction, plan completion rate, vision miscount rate, time-to-weekly-plan acceptance

---

## ⚠️ Challenges & Failure Cases
**Misread similar bottles**; cross-contamination suggestions for allergens; **unsafe “still good”** claims—confidence thresholds, “when in doubt throw out” copy, block raw chicken reuse suggestions without cook temp tool

---

## 🏭 Production Considerations
Camera data retention defaults (short TTL), household RBAC, minors’ privacy, affiliate-free nutrition claims discipline

---

## 🚀 Possible Extensions
Smart label OCR for deli dates with human confirm

---

## 🤖 Agent breakdown
- **Vision inventory tool:** returns item candidates + confidence + bbox (no cloud if policy says so).  
- **Constraint solver:** ensures allergens and dislikes never appear.  
- **Meal planner agent:** sequences recipes consuming soonest expiring SKUs first.

---

## 🎓 What You Learn
Multimodal home AI, inventory graphs, food-safety-conscious UX
