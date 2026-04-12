System Type: Agent  
Complexity: Level 4  
Industry: Fintech  
Capabilities: Prediction, Sentiment  

# FinGPT Financial Intelligence Agent

## 🧠 Overview
A **market intelligence agent** that combines **licensed market data tools** (prices, volumes, fundamentals) with **sentiment signals** (news/RSS/social where ToS allows) to produce **structured briefs**—**not** trade signals unless you add licensed execution and disclaimers. Numbers and indicators must come from **tool outputs**, not model recall.

---

## 🎯 Problem
Retail and prosumers drown in feeds; raw LLM “analysis” invents tickers and levels. You need **data contracts**, **citations**, and **risk disclosures**.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `fetch_quote`, `fetch_candles`, `fetch_news_headlines`, `compute_indicator` (server-side TA lib).

---

## ⚙️ Complexity Level
**Target:** Level 4. Multi-source retrieval + indicators + evaluation harness.

---

## 🏭 Industry
Fintech / market data / research copilots.

---

## 🧩 Capabilities
Prediction (scenario-style, not promises), Sentiment, Retrieval, Reasoning, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, market data APIs, **TA-Lib** or similar in worker, **Postgres** cache, **OpenAI SDK**, **OpenTelemetry**.

---

## 🧱 High-Level Architecture
BFF → agent → data vendor adapters → brief composer → UI; scheduled digest jobs optional.

---

## 🔄 Implementation Steps
Quotes-only bot → add news retrieval → add indicators server-side → add structured “bull/bear factors” from tool JSON → compliance review.

---

## 📊 Evaluation
Factuality vs reference data, latency, cost per brief, user trust surveys, incident rate of wrong symbols.

---

## ⚠️ Challenges & Failure Cases
**Hallucinated** prices—block without `asof` timestamps from tools. Vendor outages—stale banners. **Latency**—parallel tools with caps. **Cost**—cache candles. **Incorrect** “buy now” language—policy engine + disclaimers.

---

## 🏭 Production Considerations
Data licensing, rate limits, audit logs, no investment advice disclaimers, prompt injection via headlines (sanitize), regional regulations.

---

## 🚀 Possible Extensions
Portfolio link read-only, alerting, PDF research export.

---

## 🔁 Evolution Path
Summaries → tool-grounded analysis → optional paper trading integration (separate licensed scope).

---

## 🎓 What You Learn
Market data integration, indicator computation outside LLMs, compliance UX for finance AI.
