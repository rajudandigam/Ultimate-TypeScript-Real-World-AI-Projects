System Type: Agent  
Complexity: Level 3  
Industry: Agriculture  
Capabilities: Multimodal, Retrieval  

# Crop Disease Diagnostic Agent

## 🧠 Overview
Analyzes **leaf/canopy images** plus **optional GPS, crop type, and weather context** to suggest **disease hypotheses** with **severity bands** and **IPM-aligned treatment options**—**always** framed as **decision support**: final treatment follows **label laws**, **local extension guidance**, and **agronomist sign-off** where required.

---

## 🎯 Problem
Farmers misidentify stress (drought vs fungus); generic vision apps lack regional pest pressure; late treatment wastes chemistry and residue budget.

---

## 💡 Why This Matters
- **Pain it removes:** Delayed scouting cycles and over/under-application of inputs.
- **Who benefits:** Agronomists, cooperative advisors, and precision ag platforms.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **vision embedding + RAG** over **curated extension bulletins** (licensed); toxicology checks via **structured product DB tools**.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal + compliance-heavy outputs.

---

## 🏭 Industry
Agriculture / crop protection

---

## 🧩 Capabilities
Multimodal, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, ONNX/mobile vision models, OpenAI vision for second opinion (gated), Postgres cases, vector DB for bulletins, S3 images with TTL, OpenTelemetry

---

## 🧱 High-Level Architecture
Upload image → preprocess (resize, EXIF strip) → **Diagnostic Agent** → hypothesis JSON + similar past cases → human agronomist queue for high-stakes crops

---

## 🔄 Implementation Steps
1. Top-5 disease classifier per crop taxonomy  
2. Add symptom Q&A follow-up for disambiguation  
3. Link to labeled chem DB where API exists  
4. Field A/B on advisor acceptance  
5. Offline mode with smaller on-device model  

---

## 📊 Evaluation
Top-1/top-3 accuracy vs lab labels, time-to-advisor-review, chemical recommendation compliance rate, user-reported outcome feedback loop

---

## ⚠️ Challenges & Failure Cases
**Sun glare false lesions**; **nutrient deficiency vs disease** confusion; hallucinated product names—confidence thresholds, “unknown” class, cite bulletin IDs only, block off-label text generation

---

## 🏭 Production Considerations
EPA/FIFRA-sensitive UX, image PII (faces in field), data residency, model cards per region, adversarial uploads

---

## 🚀 Possible Extensions
Drone ortho stitch → patch-level heatmaps fed into same agent

---

## 🤖 Agent breakdown
- **Vision encoder tool:** returns embedding + saliency map token budget.  
- **RAG retriever:** pulls regional extension chunks with mandatory metadata (year, region).  
- **Synthesis agent:** ranks hypotheses, lists non-chemical interventions first, attaches uncertainty language.

---

## 🎓 What You Learn
Regulated ag AI, multimodal+RAG fusion, human-in-loop field workflows
