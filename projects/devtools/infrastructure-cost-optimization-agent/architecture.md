### 1. System Overview

**Data collectors** pull billing and utilization snapshots into a **metrics warehouse**. **Cost Opt Agent** queries through **read-only tool adapters** and emits **recommendations** stored in **Postgres** with evidence links. **Approval workflow** gates any Terraform/Cloud API mutations executed by separate automation.

---

### 2. Architecture Diagram (text-based)

```
Billing + inventory → warehouse
        ↓
Cost Opt Agent (tools: SQL, cloud APIs)
        ↓
Recommendations → human approval → optional executor
```

---

### 3. Core Components

- **UI / API Layer:** Savings inbox, policy editor, execution audit log.
- **LLM layer:** Tool-using agent; strict JSON schema for recommendations.
- **Agents (if any):** Single agent baseline; optional multi-agent later.
- **Tools / Integrations:** Athena/BigQuery, AWS Resource Groups, GCP Recommender APIs (read), K8s metrics.
- **Memory / RAG:** Org policy retrieval; historical recommendation outcomes.
- **Data sources:** CUR/DBU exports, Prometheus/Mimir, CMDB.

---

### 4. Data Flow

1. **Input:** Scheduled job triggers analysis window (e.g., trailing 30d).
2. **Processing:** Agent runs templated SQL + targeted inventory calls.
3. **Tool usage:** Assemble ranked actions with $ confidence intervals from historical variance.
4. **Output:** Persist recommendations; notify owners via Slack/email with deep links.

---

### 5. Agent Interaction (if applicable)

Single agent; **mutation tools** disabled or behind explicit human token + change window.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard analyses by OU; cache heavy query results per day.
- **Caching:** Common dimension tables; reuse prior day’s aggregates for deltas.
- **Async processing:** Long-running analyses as background jobs with progress webhooks.

---

### 7. Failure Handling

- **Retries:** Cloud API throttling with token buckets per region.
- **Fallbacks:** Partial org results with explicit coverage %; never silent full coverage.
- **Validation:** Schema validation; cap maximum % change suggestions without SLO evidence.

---

### 8. Observability

- **Logging:** Tool error taxonomy, rows scanned, redaction stats.
- **Tracing:** Query spans tagged by `ou_id` (non-PII).
- **Metrics:** Realized savings vs predicted, recommendation acceptance rate, incident correlation post-change.
