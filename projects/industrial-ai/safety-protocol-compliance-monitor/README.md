System Type: Workflow  
Complexity: Level 3  
Industry: Industrial / EHS  
Capabilities: Multimodal, Monitoring  

# Safety Protocol Compliance Monitor

## 🧠 Overview
A **workflow-first vision pipeline** for **fixed plant cameras** (and **optional wearable POV** where permitted) that detects **PPE gaps** (hard hat, hi-vis vest, safety glasses) and **zone violations** (person in energized area), raises **real-time alerts** with **evidence clips**, and feeds **EHS ticketing**—built for **false-positive control**, **union/site agreements**, and **no biometric identification** by default (event-level only).

---

## 🎯 Problem
Manual safety walks miss moments; after incidents, teams lack timestamped proof of training vs behavior; generic CV vendors ignore site-specific vest colors and restricted zones.

---

## 💡 Why This Matters
- **Pain it removes:** Preventable injuries, OSHA-style audit exposure, and inconsistent enforcement.
- **Who benefits:** EHS managers, site supervisors, and insurers reviewing loss prevention.

---

## 🏗️ System Type
**Chosen:** **Workflow** — decode → detect → track → rule engine → alert → retention; **LLM optional** only for **supervisor summary** of a shift dashboard, not per-frame.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multi-camera fusion, policies, and integration load.

---

## 🏭 Industry
Manufacturing / construction / logistics yards

---

## 🧩 Capabilities
Multimodal, Monitoring, Automation, Observability, Decision making

---

## 🛠️ Suggested TypeScript Stack
Node.js, FFmpeg/GStreamer ingest, GPU workers (YOLO-class + pose), Kafka, Redis dedupe windows, Postgres incidents, Temporal, Grafana, OpenTelemetry, Genetec/Milestone VMS hooks (examples)

---

## 🧱 High-Level Architecture
RTSP/WebRTC taps → **decode workers** → **detector workflow** (PPE + zone polygons) → **tracker** → **policy DAG** (cooldown, dual-camera confirm) → PagerDuty/Teams → CMMS/EHS export

---

## 🔄 Implementation Steps
1. Single camera + hard hat only, shadow mode  
2. Site-specific color models + vest classes  
3. Time-based hot work permits override rules  
4. Supervisor review queue with keyboard shortcuts  
5. Monthly calibration drift reports  

---

## 📊 Evaluation
Precision/recall on labeled shift footage, alert noise per 1000 worker-hours, time-to-acknowledge, repeat offender trend (aggregate, not individual surveillance creep)

---

## ⚠️ Failure Scenarios
Glare/occlusion false negatives; **similar-colored civilian clothes** false positives; camera blind spots after layout change—IR fill light policy, multi-camera corroboration, weekly polygon QA, explicit “unknown” state

---

## 🤖 / workflow breakdown
- **Ingest step:** shard by camera, normalize timestamps (PTP).  
- **Detect step:** ensemble models + site fine-tunes; outputs bounding tracks.  
- **Policy step:** deterministic rules (zone graph, permit TTL, cooldown).  
- **Notify step:** dedupe, severity, attach HLS clip + deep link.  
- **Optional LLM digest:** shift-level narrative from aggregated incident JSON only.

---

## 🎓 What You Learn
Safety-critical CV ops, privacy-preserving monitoring, workflow reliability at the edge
