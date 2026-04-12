System Type: Workflow  
Complexity: Level 4  
Industry: Film / Creator Production  
Capabilities: Multimodal, Planning  

# Script to Storyboard Generation System

## 🧠 Overview
Parses **screenplay Fountain/Final Draft exports**, segments **scenes and beats**, and produces **storyboard frame specs** (composition, lens, lighting notes, reference mood links) plus **optional image generations** from **approved style packs**—runs as **workflow DAG** with **director review** gates, **continuity tracking** (wardrobe, props), and **shot list exports** to **PDF/CSV** for ADs.

---

## 🎯 Problem
Previs is expensive; early creative alignment between writer, director, and DP is slow; ad-hoc Midjourney dumps lack continuity and legal hygiene.

---

## 💡 Why This Matters
- **Pain it removes:** Misinterpreted scenes before expensive location days.
- **Who benefits:** Indies, commercial production companies, and animation pipelines.

---

## 🏗️ System Type
**Chosen:** **Workflow** — parse → graph → shot plan → asset gen → QC; **Agent steps** optional inside **shot writer** nodes with strict schemas.

---

## ⚙️ Complexity Level
**Target:** Level 4 — long documents, multimodal outputs, rights/compliance.

---

## 🏭 Industry
Creative production

---

## 🧩 Capabilities
Multimodal, Planning, Generation, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Fountain/FDX parsers, Postgres scene graph, OpenAI Images API / SDXL self-host (policy), Three.js previz thumbnails, S3, OpenTelemetry

---

## 🧱 High-Level Architecture
Script upload → **parse workflow** → **scene graph** → **shot planner workflow** (beats → coverage) → **board spec JSON** → **render farm** (GPU) → **QC** (continuity diff) → export packages

---

## 🔄 Implementation Steps
1. Scene headings + dialogue blocks only  
2. Character registry + wardrobe continuity tags  
3. Lens pack library (16/35/50) with director presets  
4. Location feasibility flags from producer metadata  
5. Rights-cleared reference moodboard ingestion only  

---

## 📊 Evaluation
Director edit distance on shot counts, continuity error catch rate, time-to-first-board package, rights incident count (target 0)

---

## ⚠️ Failure Scenarios
**Hallucinated props**; **unfilmable blocking** in tiny practical locations; model **style drift** across frames—human sign-off per scene, locked LoRA/style seeds, explicit “needs location scout” flags

---

## 🤖 / workflow breakdown
- **Parser workflow:** AST for screenplay elements.  
- **Planner workflow:** coverage rules (master, OS, inserts).  
- **Prompt compiler nodes:** build image gen prompts from structured shot JSON only.  
- **QC workflow:** face/prop count consistency checks vs registry; block export on violations.  
- **Optional dialogue agent:** suggests shot motivation blurbs from scene text with character name locks.

---

## 🎓 What You Learn
Creative pipeline DAGs, continuity as data, rights-aware generative media
