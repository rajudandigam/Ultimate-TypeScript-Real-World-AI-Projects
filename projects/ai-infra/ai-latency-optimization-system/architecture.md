### 1. System Overview

The system comprises an **edge gateway**, **retrieval tier**, and **model provider adapters** instrumented with **OTel**. **Workflow jobs** analyze trace waterfalls, tune parameters within policy, and run **load tests** before promotion. Caches sit at **edge** and **retrieval** with explicit invalidation tied to corpus versions.

---

### 2. Architecture Diagram (text-based)

```
Client
        ↓
   Edge gateway (stream, cache, auth)
        ↓
   Retrieve / rerank (parallel with partial prompt assembly)
        ↓
   Model provider (streaming)
        ↓
   Client (incremental render)
        ↓
   Telemetry → latency optimization jobs → config PR / flag
```

---

### 3. Core Components

- **UI / API Layer:** Perf dashboards, canary controls, incident views for stream failures.
- **LLM layer:** Provider adapters; optional offline analysis jobs.
- **Agents (if any):** None on hot path.
- **Tools / Integrations:** CDN, vector DB, prompt registry, load test runners.
- **Memory / RAG:** Short TTL caches for retrieval; warm indexes for hot queries.
- **Data sources:** Traces, RUM metrics, provider latency SLOs.

---

### 4. Data Flow

1. **Input:** Client request hits edge; assign `trace_id`; begin parallel retrieval if policy enables prefetch.
2. **Processing:** Assemble minimal context pack; open streaming connection to model; forward tokens with backpressure.
3. **Tool usage:** N/A for user request; background jobs use APIs to adjust configs after tests pass.
4. **Output:** Stream completes or cancels cleanly; telemetry stored for optimization loop.

---

### 5. Agent Interaction (if applicable)

Not applicable for runtime streaming path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Edge POPs; separate stateless gateways; autoscale retrieval clusters independently.
- **Caching:** Two-tier cache; negative caching cautiously; ETags for static prompt assets.
- **Async processing:** Batch trace analysis and parameter sweeps offline.

---

### 7. Failure Handling

- **Retries:** Limited hedged requests only where idempotent and policy allows.
- **Fallbacks:** Smaller model or shorter context path with explicit user-visible notice if configured.
- **Validation:** Abort stream if tool-call JSON becomes malformed mid-flight; resync protocol.

---

### 8. Observability

- **Logging:** TTFT, time-to-last-token, disconnect reasons; aggregate by region/model.
- **Tracing:** Waterfall spans across edge, retrieve, generate; mark cache hits/misses.
- **Metrics:** p99 gaps, stream reset rate, retrieval fanout, cost per session minute.
