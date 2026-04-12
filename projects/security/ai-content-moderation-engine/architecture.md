### 1. System Overview

Content events enter an **ingress API** normalized to **cases**. **Workflow** stages: **hash/block → deterministic models → optional LLM edge → human queue → action → appeal**. Actions update product state and notify users per policy. **Evidence store** references media with strict retention rules.

---

### 2. Architecture Diagram (text-based)

```
UGC event stream
        ↓
   Moderation workflow
 ↓   ↓    ↓     ↓
hash ML   LLM  human
classifiers agent review
        ↓
   Action executor (hide/ban/escalate)
        ↓
   Audit + appeals
```

---

### 3. Core Components

- **UI / API Layer:** Moderator console, appeals, policy admin, transparency center (as allowed).
- **LLM layer:** Borderline-case agent with policy retrieval tools.
- **Agents (if any):** Single adjudication agent per case (session scoped).
- **Tools / Integrations:** Vendor classifiers, ticketing, user notification, law enforcement workflows (region-specific).
- **Memory / RAG:** Policy corpora with versioning; redacted precedent retrieval.
- **Data sources:** User text/media metadata, reputation signals (governed).

---

### 4. Data Flow

1. **Input:** Receive content payload references; virus scan; generate perceptual hashes where applicable.
2. **Processing:** Run ordered defenses; short-circuit on high-confidence severe hits with mandatory escalation paths.
3. **Tool usage:** Agent may fetch policy chunks and similar anonymized cases; cannot directly publish public sanctions without workflow completion.
4. **Output:** Persist label + confidence + reasons; enqueue notifications and appeals workflow.

---

### 5. Agent Interaction (if applicable)

Single agent per case. **Human reviewers** override with structured reason codes feeding training pipelines.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by locale/content type; autoscale GPU workers for media classifiers separately from LLM tier.
- **Caching:** Policy chunk caches; negative caches for known benign hashes (careful poisoning defenses).
- **Async processing:** Video/audio transcription and scanning off hot path with priority lanes.

---

### 7. Failure Handling

- **Retries:** Vendor retries with backoff; never drop CSAM pathway events—use dedicated highest-priority queue.
- **Fallbacks:** Route to human if automation unhealthy; show “under review” states to users where product-appropriate.
- **Validation:** Schema validation on decisions; dual control for account-level bans if configured.

---

### 8. Observability

- **Logging:** Stage outcomes, SLA timers, appeal resolutions (metadata-first).
- **Tracing:** Trace `case_id` across workflow and vendor calls (strict redaction).
- **Metrics:** Precision proxies via audits, queue age percentiles, false positive reports, vendor latency, moderator throughput.
