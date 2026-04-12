System Type: Workflow  
Complexity: Level 4  
Industry: AI Infra  
Capabilities: Retrieval  

# Domain-Specific RAG Builder (Plug & Play)

## 🧠 Overview
A **config-driven ingestion and retrieval platform** packaged as **repeatable workflows**: pick connectors (Confluence, S3, Postgres row docs), choose **chunking + embedding** profiles, define **ACL maps**, and deploy a **tenant-scoped** retrieval API—so teams ship **domain RAG** without reinventing ETL, re-embedding, and evaluation every time.

---

## 🎯 Problem
Every team rebuilds the same half-broken RAG: leaky ACLs, stale indexes, no rollback, no eval harness. A “builder” product encodes **opinionated pipelines** with **version pins** and **observability** by default.

---

## 💡 Why This Matters
- **Pain it removes:** Months to first good retrieval; production incidents from poisoned corpora; impossible debugging without lineage.
- **Who benefits:** Platform teams enabling product squads to launch assistants and copilots safely.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

RAG is **data engineering + search**: crawl/sync → normalize → chunk → embed → index → evaluate. Agents are optional on top, not the spine of the builder itself.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Multi-connector orchestration, **policy packs**, and **evaluation jobs**—L5 adds global multi-region, formal SLAs, and enterprise security certifications.

---

## 🏭 Industry
Example:
- AI Infra (RAG platforms, internal developer platforms, retrieval services)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (productized)
- Planning — light (DAG templates)
- Reasoning — optional (LLM assists chunking strategy suggestions—validated offline)
- Automation — **in scope** (scheduled syncs, re-embed)
- Decision making — bounded (routing to index variants A/B)
- Observability — **in scope**
- Personalization — optional (per-tenant synonyms)
- Multimodal — optional (image caption sidecar index)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** / **Inngest** (connectors, backfills)
- **Postgres** (catalog, ACLs, job state)
- **OpenSearch / pgvector** / managed vector DB
- **OpenAI** / **Voyage** embeddings (swappable)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Connector wizard, YAML/JSON pipeline spec, eval suite runner.
- **LLM layer:** Optional offline helpers for schema mapping suggestions—not authoritative.
- **Tools / APIs:** Connectors, tokenizer stats, index admin APIs, rerankers.
- **Memory (if any):** Pipeline version registry; per-tenant synonym tables.
- **Output:** Query API `retrieve(query, filters)` with citations + index version metadata.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single S3 bucket → chunk → embed → pgvector; manual CLI.

### Step 2: Add AI layer
- LLM proposes chunk boundaries for markdown with human approval template.

### Step 3: Add tools
- Add connector SDK interface + 2 reference connectors (S3, web crawl with allowlist).

### Step 4: Add memory or context
- Store eval results per pipeline version for regression dashboards.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **migration agent** proposes mapping when schema changes (human merge).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** nDCG/MRR on labeled Q&A sets per tenant; citation precision.
- **Latency:** p95 query latency under target QPS per index size.
- **Cost:** Embed + storage $ per million tokens indexed; re-embed churn.
- **User satisfaction:** Time for a new team to ship first retrieval endpoint.
- **Failure rate:** ACL leaks, stale doc served after delete, broken rollback.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** N/A at retrieval layer if you do not generate answers here; if you do, keep generation separate.
- **Tool failures:** Connector partial sync; mitigated by checkpoints, per-connector DLQ, visible freshness metadata.
- **Latency issues:** Oversized chunks; mitigated by adaptive chunking and prefiltering metadata.
- **Cost spikes:** Full nightly re-embed; mitigated by content hashing and incremental updates.
- **Incorrect decisions:** Wrong ACL mapping exposes other team’s docs; mitigated by automated ACL tests, red-team queries, deny-by-default.

---

## 🏭 Production Considerations

- **Logging and tracing:** Index versions in responses; avoid logging query text for sensitive tenants (configurable).
- **Observability:** Ingest lag, embed error rate, query cache hit rate, reranker latency, drift monitors.
- **Rate limiting:** Per tenant QPS; connector API quotas.
- **Retry strategies:** Exponential backoff on connectors; idempotent chunk upserts.
- **Guardrails and validation:** Block public crawl without allowlist; PII scanner on ingest (policy-dependent).
- **Security considerations:** KMS, tenant isolation, encryption in transit, audit exports for compliance reviews.

---

## 🚀 Possible Extensions

- **Add UI:** Visual pipeline editor with dry-run on sample docs.
- **Convert to SaaS:** Hosted RAG with BYOK encryption keys.
- **Add multi-agent collaboration:** Separate **evaluator agent** proposing pipeline tweaks (offline).
- **Add real-time capabilities:** Near-real-time sync via webhooks/CDC.
- **Integrate with external systems:** Langfuse-style eval, Datadog, SSO, SIEM.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **ACL + freshness** before adding generative layers.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **RAG as a data product**
  - **Incremental indexing** patterns
  - **Evaluation-first** retrieval platforms
  - **System design thinking** for internal platforms
