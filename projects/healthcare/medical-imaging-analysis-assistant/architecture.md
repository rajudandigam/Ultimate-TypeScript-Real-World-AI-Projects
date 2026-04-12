### 1. System Overview
DICOM ingest → **de-id** → **inference worker** → findings store → **agent BFF** → radiologist UI.

### 2. Architecture Diagram (text-based)
```
PACS ←→ ingestion
        ↓
   CV model service
        ↓
   Findings JSON → Agent (explain) → viewer
```

### 3. Core Components
DICOM router, object storage, model registry, GPU workers, audit, SSO.

### 4. Data Flow
Receive study → validate → queue inference → store outputs with version → present in viewer with accept/reject.

### 5. Agent Interaction
Single agent; radiologist actions are source of truth for final report.

### 6. Scaling Considerations
GPU pools; priority queues for ED; regional data residency.

### 7. Failure Handling
Inference timeouts; fallback to manual read list; never auto-send to patient.

### 8. Observability
Inference duration, GPU utilization, disagreement rate, safety catches.
