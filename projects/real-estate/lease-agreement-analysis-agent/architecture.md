### 1. System Overview
**Upload workflow** stores PDF. **OCR** produces text+bboxes. **Lease Agent** maps to **schema**. **Rules** flag outliers. **Review UI** shows highlights.

### 2. Architecture Diagram (text-based)
```
PDF → OCR → Lease Agent → clause JSON
        ↓
Risk rules → review → export
```

### 3. Core Components
Object storage, OCR workers, LLM service, rules engine, RBAC, audit trail

### 4. Data Flow
Ingest → parse pages → chunk by section heuristics → extract → validate schema → attach citations → notify reviewer

### 5. Agent Interaction
Single agent; lawyer edits authoritative

### 6. Scaling Considerations
Async OCR for bulk; per-tenant encryption keys; purge jobs per retention

### 7. Failure Handling
Low OCR confidence → manual route; partial schema → block “complete” status

### 8. Observability
Pages/min, extraction confidence histogram, human correction taxonomy
