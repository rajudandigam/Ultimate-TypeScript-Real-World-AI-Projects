System Type: Agent  
Complexity: Level 4  
Industry: Healthcare  
Capabilities: Computer Vision, Detection  

# Medical Imaging Analysis Assistant

## 🧠 Overview
**Research and clinical-decision-support blueprint** (not an **FDA-cleared** device by default): DICOM ingestion, **CV model** inference for candidate findings, and an **agent** that explains outputs in **structured reports** for radiologist review—**human read** remains authoritative; model outputs are **draft annotations** only.

---

## 🎯 Problem
Workload and variability; teams want **assistive** triage and reporting, not unaccountable automation.

---

## 🏗️ System Type
**Chosen:** Agent orchestrating **deterministic CV** tools (`run_model_v3`, `fetch_prior_study`).

---

## ⚙️ Complexity Level
**Target:** Level 4. DICOM, PACS integration, QA, clinical workflows.

---

## 🏭 Industry
Healthcare / radiology assist (governed deployment).

---

## 🧩 Capabilities
Computer Vision, Detection, Retrieval (priors), Observability.

---

## 🛠️ Suggested TypeScript Stack
**Orthanc**/DICOMweb, **OHIF** or custom viewer, **Python** inference service, **Node.js** BFF, **Postgres** metadata, audit.

---

## 🧱 High-Level Architecture
PACS → anonymized study fetch → inference → structured findings JSON → agent narrative → PACS MWL/annotation export per site policy.

---

## 🔄 Implementation Steps
Viewer-only overlays → model v1 with QA sampling → workflow for sign-off → optional regulatory path for SaMD if pursued.

---

## 📊 Evaluation
Sensitivity/specificity vs labeled set, inter-reader agreement, latency per series.

---

## ⚠️ Challenges & Failure Cases
**False negatives**—never silent auto-dismiss. **Model drift**—continuous QA. **De-identification** leaks—strict pipelines. **Hallucinated** lesions—bind narrative to bbox tool JSON only.

---

## 🏭 Production Considerations
HIPAA, audit trails, device classification legal path, incident response, versioned models, GPU capacity planning.

---

## 🚀 Possible Extensions
Multi-series fusion, triage prioritization lists, federated learning (research).

---

## 🔁 Evolution Path
Triage only → full draft report → supervised autonomy only with regulatory clearance.

---

## 🎓 What You Learn
DICOM/PACS, ML ops in clinical settings, safety culture for diagnostic assist.
