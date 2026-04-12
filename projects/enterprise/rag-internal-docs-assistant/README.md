System Type: Agent  
Complexity: Level 4  
Industry: Enterprise  
Capabilities: Retrieval, Reasoning  

# RAG-based Internal Docs Assistant

## 🧠 Overview
An **internal** question-answering agent that retrieves from **authorized** docs (wikis, runbooks, ADRs) and answers with **citations**, backed by a **continuous evaluation** loop (golden questions, regression suites) and **observability** suitable for enterprise rollout—not a public chatbot with a vector DB bolted on.

---

## 🎯 Problem
Enterprise knowledge is fragmented across Confluence, Google Drive, Git repos, and tickets. Keyword search fails for conceptual questions. Generic RAG demos ignore **ACL enforcement**, **staleness**, **chunking quality**, and **hallucination rates** that make real deployments fail security review.

---

## 💡 Why This Matters
- **Pain it removes:** Slow onboarding, repeated Slack questions, and inconsistent operational knowledge during incidents.
- **Who benefits:** IT, platform teams, and support orgs that need **traceable** answers employees can trust in regulated environments.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The product surface is a **single Q&A agent** with tools for search, fetch, and “request human escalation.” Level 4 complexity here refers to **RAG + evaluation + governance depth**, not multi-agent headcount.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4 for the **RAG subsystem maturity** (hybrid retrieval, reranking, eval harnesses, CI regressions). If you map strictly to the repo’s level definitions, think “**Level 4 RAG program**” even though orchestration is a **single agent**—document that explicitly for learners.

---

## 🏭 Industry
Example:
- Enterprise (internal knowledge, compliance-aware IT, engineering enablement)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **core**
- Planning — light (multi-step retrieval plans)
- Reasoning — **in scope** (synthesis with citations)
- Automation — optional (create ticket from answer)
- Decision making — bounded (when to abstain)
- Observability — **core**
- Personalization — optional (team-specific boosts)
- Multimodal — optional (diagrams in PDFs)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (employee portal UI)
- **Node.js** ingestion workers
- **OpenAI SDK** / **Vercel AI SDK** (streaming answers)
- **Postgres + pgvector** or **managed vector** + **OpenSearch** hybrid
- **LangChain.js** or custom chunking (prefer explicit control for ACL)
- **OpenTelemetry**, **Prometheus** metrics
- **Evals in CI** (TypeScript test runner + golden datasets)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Authenticated chat UI with `user_id`, `groups`, and optional `space` scope.
- **LLM layer:** Agent with tools: `search_docs`, `fetch_doc`, `list_sources`; abstain path when retrieval empty.
- **Tools / APIs:** Connectors to Confluence/Git/Drive with service accounts; all results tagged with ACL metadata.
- **Memory (if any):** Short session memory for follow-ups; long-term knowledge stays in indexed corpora, not the model.
- **Output:** Answer text + citation list + confidence; log retrieval IDs for replay.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- One corpus, fixed chunking, vector search only, citations by title/URL.

### Step 2: Add AI layer
- LLM answers only from provided chunks; strict “insufficient evidence” behavior.

### Step 3: Add tools
- Add hybrid search (BM25 + vector), reranker, and per-connector fetch for fresh page bodies.

### Step 4: Add memory or context
- Session summarization for pronoun resolution; user team metadata for boosting relevant spaces.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional: separate **retrieval planner** micro-agent vs **answer agent** only if offline eval shows better precision; otherwise keep as tools inside one agent.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Citation correctness rate on golden sets; faithfulness rubrics; hallucination rate on abstain tests.
- **Latency:** p95 question → first token / full answer under agreed SLOs.
- **Cost:** Cost per successful query at target quality; embedding refresh costs.
- **User satisfaction:** Thumbs, re-ask rate, escalation clicks.
- **Failure rate:** ACL violations (must be zero), empty retrieval rate, reranker timeouts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Answers without supporting chunks; mitigated by citation-required templates and automatic verification pass.
- **Tool failures:** Connector outages, partial indexes; mitigated by health checks and degraded “search only local cache” mode with banners.
- **Latency issues:** Oversized chunks and huge rerank lists; mitigated by budgets and two-stage retrieval.
- **Cost spikes:** Re-embedding entire wiki nightly; mitigated by incremental updates keyed by content hash.
- **Incorrect decisions:** Leaking doc snippets across teams; mitigated by **row-level security** in retrieval SQL and post-filter by ACL at fetch time.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log query ids and retrieved doc ids, not full doc bodies by default.
- **Observability:** Dashboards for retrieval hit rate, reranker lift, eval regression diffs on each deploy.
- **Rate limiting:** Per user and per team; burst control on expensive rerank models.
- **Retry strategies:** Connector backoff; idempotent indexing jobs.
- **Guardrails and validation:** DLP scanning on answers; block exfil patterns; prompt injection defenses on fetched HTML.
- **Security considerations:** SSO, SCIM, audit exports, VPC/private networking for vector stores, encryption keys per tenant.

---

## 🚀 Possible Extensions

- **Add UI:** Inline citations with preview panes and “report bad answer.”
- **Convert to SaaS:** Multi-tenant with strong isolation and customer-managed keys.
- **Add multi-agent collaboration:** Specialist connectors maintained by different teams behind one router.
- **Add real-time capabilities:** Live doc updates via webhooks reindexing within minutes.
- **Integrate with external systems:** Slack slash command with same backend and ACL.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Treat evaluation and ACL as part of v1, not “later hardening.”

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Production RAG**: chunking, hybrid retrieval, reranking, staleness
  - **Enterprise ACL** patterns at retrieval and generation boundaries
  - **Eval harnesses** and deployment gates for LLM apps
  - **System design thinking** for trustworthy internal assistants
