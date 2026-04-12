System Type: Agent  
Complexity: Level 3  
Industry: Personal intelligence / privacy-first consumer  
Capabilities: Memory, Personalization  

# Life Timeline Intelligence Agent

## 🧠 Overview
Builds a **user-owned structured timeline** from **opt-in sources** (photos EXIF, calendars, messaging exports, travel confirmations) to surface **patterns** (travel streaks, recurring people, health habits proxies) and **gentle reminders**—**not** a general do-everything assistant: the **timeline graph** is the product surface, with **local-first** options and **granular deletion**.

*Catalog note:* Distinct from **`Personal AI Life Assistant`** (broad L5 planning + memory copilot). This project is **timeline-centric recall + insight** with strict **consent scopes** per connector.

---

## 🎯 Problem
Memories are trapped in silos; users cannot answer “when was I last in Tokyo with Alex?” without manual archaeology; generic assistants lack durable structured memory UX.

---

## 💡 Why This Matters
- **Pain it removes:** Lost context for journaling, taxes, insurance, and family storytelling.
- **Who benefits:** Privacy-conscious individuals and “digital packrat” power users.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **timeline query tools** and **insight templates**; ingestion is **ETL jobs** the user triggers or schedules on-device.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multi-modal metadata fusion with strong privacy engineering.

---

## 🏭 Industry
Consumer productivity / personal data

---

## 🧩 Capabilities
Memory, Personalization, Planning, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Tauri or Expo (local vault), Node.js optional sync server with E2EE, SQLite/DuckDB on device, Google/Apple Calendar APIs (scoped), OpenAI SDK on-device or private relay with redaction, OpenTelemetry (opt-in diagnostics)

---

## 🧱 High-Level Architecture
Connectors → **normalization** → **event graph** (who/where/when) → **Timeline Agent** answers path queries → optional narrative “year in review” exports (offline PDF)

---

## 🔄 Implementation Steps
1. Photo EXIF + album clustering only  
2. Calendar merge with dedupe keys  
3. Chat export parsers (WhatsApp/iMessage backup patterns) with PII minimization  
4. People co-occurrence graph with merge UI  
5. Reminder rules (“visa renewal window”) tied to events  

---

## 📊 Evaluation
User-reported “found the memory” success, connector completion rate, deletion honor audits, support volume on mis-linked people

---

## ⚠️ Failure Scenarios
**Wrong person merge**; **leaked message content** to cloud LLM; **stalking misuse**—pairing confirmations, abuse reporting, block remote access modes, on-device-only inference tier

---

## 🤖 Agent breakdown
- **Ingest tools:** parse exports into canonical `LifeEvent` schema.  
- **Graph query tool:** time range + entity filters with caps.  
- **Insight agent:** proposes patterns from aggregates (counts, gaps), cites event IDs, never fabricates dates.

---

## 🎓 What You Learn
Personal knowledge graphs, E2EE product patterns, responsible memory UX
