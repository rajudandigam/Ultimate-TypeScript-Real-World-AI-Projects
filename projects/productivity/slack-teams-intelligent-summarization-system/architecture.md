### 1. System Overview
**Scheduler** enqueues digest jobs per channel config. **Fetcher** pages APIs with cursors. **Processor** redacts, chunks, and calls LLM with **frozen prompt version**. **Publisher** posts adaptive cards / messages.

### 2. Architecture Diagram (text-based)
```
Slack/Teams APIs → workflow → redact → summarize
                           ↓
                    post digest + store cursor
```

### 3. Core Components
OAuth token vault, per-tenant job queue, message normalizer, redaction library, schema validator, dead-letter queue for failed posts

### 4. Data Flow
Read since `last_ts` → merge threads → split on token budget → parallel summarize shards → merge into one digest object → single post transaction

### 5. Agent Interaction
No persistent agent; LLM is a stateless step inside workflow with temperature 0 and schema output

### 6. Scaling Challenges
Very large channels need hierarchical summarization; API 429 storms; duplicate installs in enterprise grid

### 7. Failure Handling
Partial fetch → safe resume; LLM invalid JSON → retry with repair prompt once; post failure → exponential backoff

### 8. Observability Considerations
Messages processed per minute, redaction hit rate, digest post success, cost per 1k messages, customer override/disable events
