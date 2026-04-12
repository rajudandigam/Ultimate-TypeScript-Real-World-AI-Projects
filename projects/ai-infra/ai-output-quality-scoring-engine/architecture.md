### 1. System Overview

Scoring workers consume **normalized events** from a queue, optionally fetch **trace and retrieval evidence**, run **rules + model judges**, and write **score documents** to an analytics store. Critical path APIs can use **async** scoring or **lightweight** checks synchronously based on policy.

---

### 2. Architecture Diagram (text-based)

```
LLM app (instrumented)
        ↓ (OTel + score event)
   Ingest / sampling layer
        ↓
   Scoring queue
        ↓
   Quality Scoring Agent
     ↙     ↓     ↘
fetchTrace fetchRubric verifyCitations
        ↓
   Score store (Postgres / columnar export)
        ↓
   Alerts / dashboards / human queue
```

---

### 3. Core Components

- **UI / API Layer:** Reviewer console, threshold admin, appeals workflow.
- **LLM layer:** Scoring agent with bounded tools and structured output schema.
- **Agents (if any):** Primary scorer; optional specialist judges as separate deployments.
- **Tools / Integrations:** Trace backend, policy service, ticketing webhooks.
- **Memory / RAG:** Rubric retrieval; rolling baseline stats in TSDB.
- **Data sources:** Redacted prompts/outputs, retrieval chunks, tool I/O summaries.

---

### 4. Data Flow

1. **Input:** Receive event with trace correlation; apply sampling and tenant policy.
2. **Processing:** Run deterministic checks; if needed, assemble evidence bundle under token cap.
3. **Tool usage:** Fetch traces/docs; compute citation coverage; produce score vector + rationales.
4. **Output:** Persist record; emit metric series; route to human queue if severity exceeds threshold.

---

### 5. Agent Interaction (if applicable)

Single scoring agent per event by default. Multi-judge runs as **parallel independent scorers** merged by fixed formula—not conversational multi-agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale scorer workers; isolate expensive tenants.
- **Caching:** Cache rubric chunks; cache frequent policy lexicon lookups.
- **Async processing:** Default path async to protect user-facing latency.

---

### 7. Failure Handling

- **Retries:** Model retries with backoff; cap total time per event.
- **Fallbacks:** Rules-only score with explicit uncertainty flags.
- **Validation:** Reject malformed events; dead-letter unknown schema versions.

---

### 8. Observability

- **Logging:** Score version, model id, latency, evidence fetch success flags.
- **Tracing:** Link scorer spans to original `trace_id` from producer service.
- **Metrics:** Score drift by surface, queue lag, cost per scored event, appeal overturn rate.
