### 1. System Overview
Invoices → **ingest workflow** → **extract** → **normalize** → **match** (PO/GRN) → **post or exception**.

### 2. Architecture Diagram (text-based)
```
Upload/SFTP → workflow
  → OCR → structured rows
  → match engine → ERP adapter / exception queue
```

### 3. Core Components
Object storage, OCR, match rules engine, ERP connector, exception UI, audit log.

### 4. Data Flow
Hash dedupe → extract → join dimensions → score matches → auto-post if above threshold else queue.

### 5. Agent Interaction
Optional LLM to **summarize** exception reason codes for AP—not match authority.

### 6. Scaling Considerations
Queue workers by tenant; batch ERP posts; cache vendor alias tables.

### 7. Failure Handling
DLQ; partial apply forbidden; compensating entries on ERP rollback.

### 8. Observability
Match confidence histogram, exception age, ERP error codes, OCR failure rate.
