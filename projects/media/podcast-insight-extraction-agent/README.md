System Type: Agent  
Complexity: Level 2  
Industry: Media  
Capabilities: Extraction  

# Podcast Insight Extraction Agent

## 🧠 Overview
Turns **episode audio** into **chapters, summaries, key quotes, topics, and guest mentions** with **timestamps**—uses **ASR + diarization** tools; LLM structures output **only** from transcript text; **disclaimer** for proper nouns and **fact-sensitive** claims; human publisher reviews before RSS update.

---

## 🎯 Problem
Show notes lag episodes; SEO and clip discovery suffer; manual transcription is expensive.

---

## 💡 Why This Matters
Improves discoverability and repurposing without misrepresenting speakers.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using).

---

## ⚙️ Complexity Level
**Target:** Level 2.

---

## 🏭 Industry
Podcasting / audio media

---

## 🧩 Capabilities
Extraction, Generation, Multimodal (speech), Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, ASR vendor or Whisper, OpenAI SDK structured outputs, Postgres episode store, RSS/hosting APIs, OpenTelemetry

---

## 🧱 High-Level Architecture
RSS poll or upload → transcribe → agent emits chapter JSON → editor UI → publish to CMS/host

---

## 🔄 Implementation Steps
ASR only → add summarizer → add quote extraction with char offsets → sponsor read detection optional → auto-post with human default-off

---

## 📊 Evaluation
WER proxy, human edit distance on summaries, chapter usefulness ratings, time saved per episode

---

## ⚠️ Challenges & Failure Cases
Misattributed speakers; hallucinated quotes; copyrighted lyrics in music beds; PII in live Q&A—diarization confidence thresholds, blocklist, redaction, human QC for sensitive shows

---

## 🏭 Production Considerations
Retention policy for audio, consent for voice cloning adjacent features (off by default), ADA transcripts

---

## 🚀 Possible Extensions
Clip suggestions for Shorts/Reels with safe crop metadata

---

## 🔁 Evolution Path
Manual notes → ASR → structured extraction → optional auto-publish with guardrails

---

## 🎓 What You Learn
Audio NLP pipelines, timestamp-grounded summarization, publishing workflows
