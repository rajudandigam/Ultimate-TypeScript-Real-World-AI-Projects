System Type: Agent  
Complexity: Level 4  
Industry: Climate / Risk  
Capabilities: Simulation, Prediction  

# Climate Risk Scenario Simulation Agent

## 🧠 Overview
Helps **risk and resilience teams** stress-test **sites and supply chains** under **climate scenarios** (pluvial flood, riverine flood, heat stress, wind)—combines **hazard layers** (licensed models/APIs), **asset exposure**, and **business continuity data** to produce **quantified exposure bands** and **mitigation option cards**—**not** a replacement for certified engineering studies; outputs are **decision support** with **cited sources**.

*Catalog note:* Distinct from **`Climate & Sustainability Intelligence Agent`** (operational **carbon/ESG analytics**). This project is **physical hazard scenario** exploration for **continuity and capex**.

---

## 🎯 Problem
Boards ask “what if” questions; spreadsheets cannot fuse geospatial hazard with SKU-level supply nodes; insurance asks for coherent narratives.

---

## 💡 Why This Matters
- **Pain it removes:** Opaque climate risk in capex and insurance renewals.
- **Who benefits:** CFO office, resilience leads, and infrastructure PMs.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **simulation + GIS tools**; hazard math from **approved datasets**, not LLM invention.

---

## ⚙️ Complexity Level
**Target:** Level 4 — geospatial joins, uncertainty, and multi-stakeholder reporting.

---

## 🏭 Industry
Climate risk / enterprise resilience

---

## 🧩 Capabilities
Simulation, Prediction, Planning, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, PostGIS, raster tile services (STAC/COG), FEMA/USGS or commercial hazard APIs (licensed), BigQuery for asset tables, OpenAI SDK for narrative on **numeric outputs only**, OpenTelemetry

---

## 🧱 High-Level Architecture
Asset registry + geocode → **Scenario Agent** pulls hazard layers for RCP/SSP selections → exposure compute → mitigation library match → PDF/BI export with assumptions sheet

---

## 🔄 Implementation Steps
1. Single-site flood depth binning MVP  
2. Supply chain graph + multi-hop supplier sites  
3. Heat downtime hours for data center PUE sensitivity  
4. Capex optioneering (raise gens, relocate SKU) as structured cards  
5. Versioned scenario packs for audit replay  

---

## 📊 Evaluation
Calibration vs historical events where available, scenario runtime, executive trust score, % mitigations adopted in pilots

---

## ⚠️ Failure Scenarios
**Outdated hazard layers**; **geocode errors** shift site into wrong cell; **overconfident single numbers**—confidence intervals, source vintages on every map, “engage licensed engineer” flags for structural design

---

## 🤖 Agent breakdown
- **GIS tools:** spatial joins, depth-duration metrics, aggregation by asset class.  
- **Scenario composer:** selects parameters from org-approved scenario library.  
- **Narrator agent:** writes exec summary strictly from tool JSON + hazard metadata IDs.

---

## 🎓 What You Learn
Climate risk product patterns, geospatial + LLM guardrails, resilience comms
