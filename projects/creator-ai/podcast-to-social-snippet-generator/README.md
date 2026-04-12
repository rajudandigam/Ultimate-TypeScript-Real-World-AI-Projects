System Type: Workflow  
Complexity: Level 3  
Industry: Creator / Media  
Capabilities: Multimodal, Extraction  

# Podcast to Social Snippet Generator

## 🧠 Overview
**Workflow-first** pipeline: transcribe episodes, **detect highlight windows** (laughter spikes, applause, quotable lines via NLP + optional vision on waveform), **reframe** for vertical video specs, **burn captions**, and enqueue **render jobs**—distinct from **`Podcast Insight Extraction Agent`** (chapters/show notes): this system targets **short-form distribution** with **brand-safe zones** and **rights checks**.

---

## 🎯 Problem
Clipping for TikTok/Reels/Shorts is manual; wrong aspect ratios and missing captions tank reach; music rights trip automated exports.

---

## 💡 Why This Matters
- **Pain it removes:** Repurposing cost for indie podcasters and network social teams.
- **Who benefits:** Creators, agencies, and podcast networks.

---

## 🏗️ System Type
**Chosen:** **Workflow** — ASR, scoring, ffmpeg renders, and QC gates are **deterministic**; optional LLM for **title variants** only.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal pipeline + render farm integration.

---

## 🏭 Industry
Creator economy

---

## 🧩 Capabilities
Multimodal, Extraction, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Whisper-class ASR, FFmpeg workers, OpenAI optional for hook copy, S3, BullMQ, OpenTelemetry, YouTube/TikTok upload APIs (policy-compliant)

---

## 🧱 High-Level Architecture
RSS or file drop → transcribe → highlight scorer → **snippet spec JSON** → human QC lane → GPU render → publish queue → analytics feedback loop

---

## 🔄 Implementation Steps
1. Auto 45s clips from transcript keyword hits  
2. Face-safe crop heuristics + title safe areas  
3. Template packs per show brand  
4. A/B title testing metadata only  
5. Rights-aware music stem separation or mute policy  

---

## 📊 Evaluation
Human accept rate of clips, watch-through on published shorts, render cost per minute, copyright strike count (target 0)

---

## ⚠️ Challenges & Failure Cases
**False highlights** on tangents; **burned-in guest PII**; platform-specific caption safe zones—human QC for sensitive shows, redaction pass, max clip count per episode

---

## 🏭 Production Considerations
DRM on masters, tenant isolation, GPU autoscaling, storage lifecycle, quota per network

---

## 🚀 Possible Extensions
Auto-generated thread of quote cards for X from same highlight JSON

---

## 🤖 Agent breakdown
Workflow steps (not autonomous multi-agent): **ASR worker** → **scorer** (rules + small model) → **copy variant LLM** (optional) → **renderer** → **publisher**; humans gate brand-sensitive shows.

---

## 🎓 What You Learn
Media pipelines at scale, QC for short-form, rights-aware automation
