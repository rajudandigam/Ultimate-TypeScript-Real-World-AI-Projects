### 1. System Overview
**Connector plane** writes canonical documents + ACL edges. **Index plane** enforces security filters. **Query plane** runs agent tools that always include `principal` context.

### 2. Architecture Diagram (text-based)
```
Sources → ETL → ACL graph → secured index
                     ↓
        RAG agent (principal-scoped tools) → answers
```

### 3. Core Components
IDP integration (SCIM/OIDC groups), document store, OCR workers, reranker service, audit log, admin UI for blocklists

### 4. Data Flow
Ingest doc → extract text/tables → attach ACL snapshot id → index → on query expand groups → filter hits → rerank → return cited spans

### 5. Agent Interaction
Agent must call `search` with explicit `collection_ids`; server rejects mismatched principal; no “admin bypass” in tool layer

### 6. Scaling Challenges
Massive ACL fan-out; hot documents; incremental deletes; multilingual tokenization

### 7. Failure Handling
Connector partial failure → mark corpus degraded; ACL unknown → deny read; index lag metrics page ops

### 8. Observability Considerations
Query latency (p95), zero-result rate, authz denials, drift between IDP and index, connector backlog depth
