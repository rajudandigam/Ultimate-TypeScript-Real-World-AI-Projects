### 1. System Overview

Alerts create **cases** in Postgres with RBAC. A **workflow** stages investigation: scope → query → hypothesize → draft → QC → supervisor sign-off. **Detector**, **Analyst**, and **Reviewer** agents each have **tool allowlists**. **Evidence store** holds immutable references to underlying records (not raw dumps in LLM logs by default).

---

### 2. Architecture Diagram (text-based)

```
TM alert → case workflow
        ↓
   Evidence subgraph builder (bounded)
        ↓
   Detector Agent (pattern tools)
        ↓
   Analyst Agent (narrative draft tools)
        ↓
   Reviewer Agent (QC rubric + policy tools)
        ↓
   Human AML officer approval
        ↓
   Case export / SAR worksheet (human filed)
```

---

### 3. Core Components

- **UI / API Layer:** Analyst workstation, supervisor approvals, audit viewer.
- **LLM layer:** Multi-agent reasoning with citation requirements.
- **Agents (if any):** Detector, analyst, reviewer (+ optional supervisor LLM summarizer).
- **Tools / Integrations:** TM system, core banking queries (read), KYC vault pointers, sanctions.
- **Memory / RAG:** Typology retrieval; internal procedures with access logs.
- **Data sources:** Transactions, parties, KYC summaries, watchlist hits.

---

### 4. Data Flow

1. **Input:** Alert ingested; case created; assign analyst and priority.
2. **Processing:** Build bounded subgraph; detector proposes hypotheses with supporting txn IDs.
3. **Tool usage:** Analyst queries additional slices via audited tools; reviewer runs QC checklist tools.
4. **Output:** Draft narrative package versioned; human edits tracked; final disposition recorded.

---

### 5. Agent Interaction (if applicable)

**Reviewer** can send structured rework requests to **Analyst** without exposing customer channels (no tipping-off). **Supervisor** resolves conflicts and enforces closure deadlines.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition case workers by region/tenant; isolate LLM inference pools from query services.
- **Caching:** Reuse subgraph snapshots per case version; invalidate on new data pulls.
- **Async processing:** Heavy graph queries as background activities with progress UI.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; partial results clearly labeled incomplete.
- **Fallbacks:** Manual mode if agents disabled; retain structured query results.
- **Validation:** Block exports missing mandatory sections; block narrative if citations missing.

---

### 8. Observability

- **Logging:** Tool access audit, agent stage timings, QC failure reasons (structured).
- **Tracing:** Trace `case_id` across workflow and agent tool calls (PII minimized).
- **Metrics:** Case backlog age, analyst throughput, QC rework rate, factual correction incidents (target low), export volume anomalies.
