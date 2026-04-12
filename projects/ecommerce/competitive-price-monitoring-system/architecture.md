### 1. System Overview

**Scheduler** enqueues **fetch tasks** partitioned by domain. **Fetcher workers** retrieve pages or call APIs, storing raw payloads to **object storage** when needed. **Parser registry** selects versioned extractors to emit **normalized events**. **Alert workflow** compares against rules and notifies subscribers.

---

### 2. Architecture Diagram (text-based)

```
Scheduler → fetch workers → raw store (optional)
        ↓
Parser registry → normalized events → time-series DB
        ↓
Alert workflow → Slack/email → optional LLM digest
```

---

### 3. Core Components

- **UI / API Layer:** Watchlist CRUD, extractor editor with preview, incident inbox.
- **LLM layer:** Optional summarization service fed only structured diffs.
- **Agents (if any):** None required in v1.
- **Tools / Integrations:** PIM, MAP policy service, ticketing webhooks.
- **Memory / RAG:** Historical series DB; robots.txt cache.
- **Data sources:** Competitor sites, marketplace APIs, partner feeds.

---

### 4. Data Flow

1. **Input:** Tick per `(sku, source)` with jitter.
2. **Processing:** Fetch → parse → normalize currency/units.
3. **Tool usage:** Compare to previous point; evaluate alert rules.
4. **Output:** Notifications + dashboard updates + audit record.

---

### 5. Agent Interaction (if applicable)

Not applicable for core monitoring. Optional **extractor-assist** agent stays offline in CI with human merge.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard fetchers by domain; isolate noisy tenants.
- **Caching:** ETag-aware fetches; CDN for static assets if applicable.
- **Async processing:** Heavy HTML parsing off hot path; backpressure via queue depth metrics.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on 429/5xx; rotate proxies only where contractually allowed.
- **Fallbacks:** Switch to API source if HTML extractor fails canary tests.
- **Validation:** Reject absurd jumps without corroboration (data quality gates).

---

### 8. Observability

- **Logging:** Structured events with `extractor_version`, `http_status`.
- **Tracing:** Trace fetch→parse→alert for stuck SKUs.
- **Metrics:** Freshness SLO, parse success ratio, alert precision estimates from sampling.
