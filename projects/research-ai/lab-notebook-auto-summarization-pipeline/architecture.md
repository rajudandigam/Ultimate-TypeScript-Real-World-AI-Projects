### 1. System Overview
**Object store** holds immutable page images. **Workflow** emits versioned structured records. **ELN connector** applies idempotent upserts with correlation IDs.

### 2. Architecture Diagram (text-based)
```
Scan → OCR/layout → extract → validate → review → ELN commit
```

### 3. Core Components
Batch scanner ingest, QC sampling scheduler, schema registry per discipline, audit trail, retention policies per sponsor contract

### 4. Data Flow
Batch id → parallel page workers → merge partials → validate against JSON schema → open review if confidence low → on approve post to ELN → archive batch

### 5. Agent Interaction
LLM steps are stateless subtasks with temperature 0; no agent autonomy across batches without user token

### 6. Scaling Considerations
Large notebook uploads: chunk pages; autoscale OCR workers; cache embeddings of similar templates for warm-start

### 7. Failure Modes
Partial batch failure → resume from last page checkpoint; schema migration mid-flight → versioned mappers

### 8. Observability Considerations
Pages/hour, OCR confidence histogram, human edit distance, ELN API error rate, storage growth per lab
