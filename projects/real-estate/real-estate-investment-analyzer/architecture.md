### 1. System Overview
**Deal ingest** stores docs. **Extractors** map to **canonical deal model**. **Finance core** computes KPIs and sensitivities. **Analyzer Agent** reads outputs + snippets and writes **memo sections** with citations to table ids.

### 2. Architecture Diagram (text-based)
```
Docs → ETL → deal model → finance core
        ↓
Analyzer Agent → memo JSON/PDF
```

### 3. Core Components
VDR connector optional, parser workers, calc engine, agent BFF, export templates, audit log

### 4. Data Flow
Upload versioned docs → extract → validate balances → compute scenarios → generate narrative → human IC edits

### 5. Agent Interaction
Single agent; never override computed numbers—reference only

### 6. Scaling Considerations
Async extraction for large datarooms; cache intermediate tables per `deal_id@version`

### 7. Failure Handling
Balance sheet tie-out failure → block narrative “final” stamp; show diffs to analyst

### 8. Observability
Extraction accuracy metrics, compute latency, human override tags, export counts
