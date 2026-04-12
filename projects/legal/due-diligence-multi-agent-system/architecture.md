### 1. System Overview
**VDR connector** lands files with labels. **Indexer** stores chunks with **document-level ACLs**. **Supervisor** assigns tasks to domain agents and merges **typed finding records** (severity, evidence spans, owner).

### 2. Architecture Diagram (text-based)
```
VDR → index (ACL) → financial / legal / tech agents
                           ↓
                    synthesizer → memo → review queue
```

### 3. Core Components
Search (hybrid), OCR workers, entity linker, citation validator, RBAC, audit log immutable store, export service

### 4. Data Flow
New upload event → enqueue reindex → agents pull scoped queries only → findings deduped by fingerprint → supervisor compiles narrative sections

### 5. Agent Interaction
Agents cannot see whole dataroom—queries scoped by folder tags; synthesizer only sees structured finding JSON + allowed excerpts

### 6. Scaling Challenges
Terabyte rooms; PDFs with scanned tables; concurrent deals; expensive reranking—tiered processing and caching

### 7. Failure Handling
Partial index → mark coverage gaps explicitly; conflicting agent conclusions → surface as “needs human reconciliation”

### 8. Observability Considerations
Pages indexed per hour, query latency, finding throughput, human edit distance on final memos, access denied events (expected vs bug)
