### 1. System Overview

**ETL workflows** ingest source systems into **entity and relationship tables**, promoted into a **property graph** with **provenance** properties. **Chunk index** stores document embeddings linked to graph nodes. **Query API** authenticates users and calls **GraphRAG Agent** with **tool policies** (max hops, max nodes). Responses include **citations** to chunk ids and **edge ids**.

---

### 2. Architecture Diagram (text-based)

```
Source systems → ETL (Temporal)
        ↓
   Graph DB + vector chunk index
        ↓
   GraphRAG Agent
     ↙     ↘
graph traverse   vector retrieve
        ↓
   Answer composer (grounded)
```

---

### 3. Core Components

- **UI / API Layer:** Question answering UI, graph explorer, ontology admin.
- **LLM layer:** Tool-using agent with traversal budgets.
- **Agents (if any):** Primary analyst agent; optional offline extractor services.
- **Tools / Integrations:** Graph query API (sandboxed), vector search, document store.
- **Memory / RAG:** Session entity pins; retrieval over docs and graph summaries.
- **Data sources:** CRM, tickets, wikis, logs (permissioned).

---

### 4. Data Flow

1. **Input:** User question; resolve tenant and entitlements; attach allowed entity types.
2. **Processing:** Agent plans traversals; executes bounded queries; retrieves supporting chunks.
3. **Tool usage:** Each tool returns JSON with ids; model composes explanation referencing ids only.
4. **Output:** Render answer + “evidence” drawer with links to source systems where permitted.

---

### 5. Agent Interaction (if applicable)

Single user-facing agent. **Graph maintenance** is non-conversational batch jobs.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Read replicas for graph; sharding by tenant; separate vector search cluster; cache hot subgraph summaries.
- **Caching:** Memoize frequent traversals with short TTL; negative cache for missing entities.
- **Async processing:** Heavy ETL and re-embedding off interactive path.

---

### 7. Failure Handling

- **Timeouts:** Hard caps on traversal time and node counts; return partial evidence set explicitly.
- **Fallbacks:** Vector-only mode if graph unhealthy (flagged).
- **Validation:** Reject queries expanding across disallowed relationship types.

---

### 8. Observability

- **Logging:** Traversal stats, tool errors, policy denials (minimal PII).
- **Tracing:** Trace `question_id` across graph and vector calls.
- **Metrics:** p95 answer latency, nodes touched distribution, zero-evidence rate, ETL freshness lag, cost per question.
