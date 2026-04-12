System Type: Workflow  
Complexity: Level 4  
Industry: Earth observation / Geo intelligence  
Capabilities: Multimodal, Detection  

# Satellite Change Detection Workflow

## 🧠 Overview
A **production EO change-detection pipeline** that aligns **multitemporal satellite stacks** (optical and/or SAR), computes **spectral/structural change metrics**, classifies **change type candidates** (construction, harvest, disturbance), and raises **alerts with geospatial footprints**—targets **insurance, forestry compliance, urban planning, and supply-chain site monitoring** with **human QC** lanes.

---

## 🎯 Problem
Manual image comparison does not scale; naive differencing flags clouds and seasonality as “change”; stakeholders need explainable polygons.

---

## 💡 Why This Matters
- **Pain it removes:** Late awareness of encroachment, illegal clearing, or competitor facility expansion.
- **Who benefits:** Geospatial analysts, ESG field teams, and defense-adjacent monitoring vendors.

---

## 🏗️ System Type
**Chosen:** **Workflow** — preprocess → coregister → index/shape metrics → threshold → vectorize → review; **LLM optional** for **analyst captions** from structured change JSON only.

---

## ⚙️ Complexity Level
**Target:** Level 4 — big rasters, cloud masking, and ops discipline.

---

## 🏭 Industry
Remote sensing / intelligence products

---

## 🧩 Capabilities
Multimodal, Detection, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, GDAL/rasterio workers (Python), STAC catalogs, Sentinel/Landsat/Planet APIs (licensed), PostGIS, COG on S3, OpenTelemetry

---

## 🧱 High-Level Architecture
AOI subscription → **fetch workflow** (STAC items) → **preprocess** (cloud mask, BRDF normalize) → **align** → **change metrics** → **segment** → **classify** (model) → **alert workflow** → dashboard + webhook

---

## 🔄 Implementation Steps
1. Pairwise optical diff with strict cloud mask  
2. Add SAR coherence for persistent monitoring  
3. Parcel/lease boundary overlays for compliance  
4. Confidence calibration with field labels  
5. Export GeoJSON + PDF evidence packs  

---

## 📊 Evaluation
IoU vs human polygons, false alert rate per AOI km², median pipeline hours, API $ per km² monitored

---

## ⚠️ Failure Scenarios
**Misregistration** causes ghost change; **seasonal crop rotation** false positives; **license restrictions** on redistribution—coregistration QC, phenology-aware models, export redaction per provider ToS

---

## 🤖 / workflow breakdown
- **Ingest workflow:** STAC query, checksum, tile cache.  
- **Preprocess worker pool:** radiometry, cloud/snow masks.  
- **Change workflow:** CVA/SAR coherence + optional deep change detector.  
- **Vectorization:** polygon simplification + minimum mapping unit.  
- **Optional caption agent:** consumes metrics + class labels; never invents coordinates.

---

## 🎓 What You Learn
STAC-scale raster ops, geospatial ML deployment, evidence-grade EO products
