### 1. System Overview

**Poller workflows** fetch allowlisted URLs on schedules, store **content-addressed** snapshots, compute **diffs**. **CI Agent** consumes `ChangeEvent` records and proposes **battle card updates** with citations. **Review UI** approves outward-facing diffs; **publisher** syncs to Notion/Slack/Seismic.

---

### 2. Architecture Diagram (text-based)

```
Watchlist → fetch → snapshot store → diff engine
        ↓
CI Agent → battle card patch proposal
        ↓
Human review → enablement systems
```

---

### 3. Core Components

- **UI / API Layer:** Watchlist admin, legal flags, digest subscriptions.
- **LLM layer:** Summarization and implication drafting from structured diffs.
- **Agents (if any):** Single agent for v1 synthesis.
- **Tools / Integrations:** HTTP fetchers (policy-bound), OCR for PDF changelogs, licensed news APIs.
- **Memory / RAG:** Internal positioning and win/loss corpus.
- **Data sources:** Competitor sites, release feeds, filings, community forums (careful ToS).

---

### 4. Data Flow

1. **Input:** Poll tick with jitter; respect robots/terms.
2. **Processing:** Normalize text; compute diff vs last snapshot hash.
3. **Tool usage:** If meaningful change, retrieve related internal positioning chunks.
4. **Output:** Create `change_event` + draft card section; notify PMM queue.

---

### 5. Agent Interaction (if applicable)

Single agent; external claims require human sign-off tier configurable.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard pollers by domain; isolate noisy sites.
- **Caching:** ETag-aware fetches; skip unchanged bodies quickly.
- **Async processing:** Heavy HTML cleaning off hot path.

---

### 7. Failure Handling

- **Retries:** Backoff on 429/5xx; circuit breakers per domain.
- **Fallbacks:** Mark source `degraded` and continue others.
- **Validation:** Reject empty diffs caused by layout-only noise; tunable noise filters.

---

### 8. Observability

- **Logging:** HTTP status classes, bytes fetched, diff sizes, model versions.
- **Tracing:** Poll→diff→notify latency per source.
- **Metrics:** True positive change rate (human labels), alert noise, time-to-update card.
