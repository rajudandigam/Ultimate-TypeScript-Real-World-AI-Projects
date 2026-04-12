System Type: Agent  
Complexity: Level 3  
Industry: Marketing  
Capabilities: Monitoring  

# Competitive Intelligence Monitoring Agent

## 🧠 Overview
A **CI agent** that monitors **allowlisted** competitor sources (sites, changelogs, pricing pages, release notes, SEC filings where applicable) via **scheduled fetches** and **change detection**, then produces **battle card deltas** with **citations**—**no** gray-area scraping; **ToS-respecting** ingestion and **human review** for outward-facing claims.

---

## 🎯 Problem
Sales loses deals to surprise launches; teams learn competitor moves from random Slack screenshots instead of structured intel.

---

## 💡 Why This Matters
- **Pain it removes:** Stale battle cards, inconsistent positioning, and slow competitive response.
- **Who benefits:** Product marketing, PMM, and sales enablement in competitive categories.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Workflows handle fetch/diff; agent summarizes **structured diffs** into **card updates** with evidence links.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Retrieval over internal positioning + external change feeds + synthesis; L4+ adds multi-agent (facts vs narrative) with conflict logging.

---

## 🏭 Industry
Example:
- Marketing / competitive intelligence

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal positioning docs, win/loss notes
- Planning — bounded (weekly intel digest structure)
- Reasoning — bounded (implications for pitch)
- Automation — Slack/Notion updates, ticket creation
- Decision making — bounded (severity of change)
- Observability — **in scope**
- Personalization — per-vertical battle cards
- Multimodal — optional screenshot diff of pricing pages (policy gated)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**, **Inngest**/**Temporal** for pollers
- **Playwright** only where permitted; prefer **RSS/APIs**
- **Postgres** + **diff** store; **OpenAI SDK** for summaries
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Watchlist registry, frequency, legal-approved domains.
- **LLM layer:** Agent turns `ChangeEvent[]` into battle card patch proposals.
- **Tools / APIs:** Fetchers, HTML/text diff, SEC EDGAR (where used legally), news APIs (licensed).
- **Memory (if any):** Versioned battle cards; embedding index over internal win stories.
- **Output:** Slack digest + Notion page update PR (human merge).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual RSS reader links in Notion.

### Step 2: Add AI layer
- LLM summarizes a pasted diff text for PMM.

### Step 3: Add tools
- Automated diff pipeline with hash-stable storage and rollback.

### Step 4: Add memory or context
- Link changes to CRM win/loss tags for relevance ranking.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Separate **fact extractor** vs **narrative writer** with citation enforcement.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human-verified precision of claimed changes vs ground truth spot checks.
- **Latency:** Time from competitor publish to first internal alert within SLO.
- **Cost:** Fetch + storage + LLM $ per competitor per month.
- **User satisfaction:** Sales usage of updated cards in calls; win rate deltas (hard causal).
- **Failure rate:** False change alerts (A/B noise), legal issues from disallowed scraping.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Misread pricing; require DOM snapshot or structured extract + human ack for $ claims.
- **Tool failures:** Bot blocks; rotate to official APIs or pause with explicit reason.
- **Latency issues:** Large pages; extract main content server-side before LLM.
- **Cost spikes:** Too-frequent polls; exponential backoff and importance tiers.
- **Incorrect decisions:** Publishing unverified rumors; source reputation scoring + dual review for externals.

---

## 🏭 Production Considerations

- **Logging and tracing:** URL, checksum, extractor version; minimize storing full HTML if not needed.
- **Observability:** Fetch success %, diff noise rate, alert fatigue metrics.
- **Rate limiting:** Per-domain politeness; global concurrency caps.
- **Retry strategies:** Idempotent event ids for same content hash.
- **Guardrails and validation:** Legal allowlist; PII scrubbing from captured pages; watermark “unverified” states.
- **Security considerations:** Secrets for licensed feeds, tenant isolation for multi-product companies.

---

## 🚀 Possible Extensions

- **Add UI:** Timeline of competitor feature launches vs yours.
- **Convert to SaaS:** CI platform for mid-market SaaS.
- **Add multi-agent collaboration:** PMM editor agent with style constraints only.
- **Add real-time capabilities:** Webhooks from partner data shares where available.
- **Integrate with external systems:** Klue, Crayon, Gong competitive trackers.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **compliant ingestion + citations** before broad web automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Ethical competitive** data collection
  - **Diff-driven** intelligence pipelines
  - **Enablement** content lifecycle
  - **System design thinking** for PMM ops
