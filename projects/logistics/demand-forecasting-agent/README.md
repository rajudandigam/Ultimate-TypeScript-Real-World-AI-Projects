System Type: Agent  
Complexity: Level 3  
Industry: Logistics  
Capabilities: Prediction  

# Demand Forecasting Agent

## 🧠 Overview
Forecasts **SKU/location demand** by querying **warehouse sales history**, **promotions**, and **seasonality features** via tools—combines **statistical baseline** (ETS/Prophet-style or precomputed cubes) with **LLM explanations** and **anomaly flags** for planners; **numbers from models/code**, not LLM arithmetic.

---

## 🎯 Problem
Stockouts and overstocks hurt margin; spreadsheet forecasts break when assortment changes quickly.

---

## 💡 Why This Matters
Better **inventory positioning** and **S&OP** alignment across channels.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over warehouse + forecast service APIs.

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Supply chain / retail & CPG

---

## 🧩 Capabilities
Prediction, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Snowflake/BigQuery, dbt marts, Python forecast microservice optional, OpenAI SDK, Postgres forecast registry, OpenTelemetry

---

## 🧱 High-Level Architecture
ETL marts → forecast engine API → agent explains drivers & recommends overrides → export to ERP/APS

---

## 🔄 Implementation Steps
Baseline ARIMA/seasonal naive → add promo calendar tool → agent narrative → planner feedback loop → automated publish to low-risk SKUs (policy)

---

## 📊 Evaluation
WAPE/MAPE vs holdout, inventory turns, stockout rate, planner override rate

---

## ⚠️ Challenges & Failure Cases
Cold-start SKUs; promotion cannibalization; LLM confabulating growth rates; data lag—use hierarchical reconciliation, uncertainty intervals, governance on auto-orders

---

## 🏭 Production Considerations
RLS in warehouse, versioned forecasts, audit for PO impacts, cost caps on queries

---

## 🚀 Possible Extensions
New product analogous mapping, multi-echelon inventory hints

---

## 🔁 Evolution Path
Static models → tool-backed agent narratives → closed-loop replenishment tie-in

---

## 🎓 What You Learn
S&OP data contracts, forecast governance, safe copilots for planners
