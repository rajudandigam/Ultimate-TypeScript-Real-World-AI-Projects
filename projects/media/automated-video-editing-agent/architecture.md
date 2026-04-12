### 1. System Overview
**Ingest** stores masters. **Analysis workers** produce **transcript + scene map**. **Edit Agent** outputs **EDL JSON**. **Renderer** consumes EDL deterministically. **QC** gates publish.

### 2. Architecture Diagram (text-based)
```
Video → ASR/scenes → Edit Agent → EDL
        ↓
FFmpeg render → preview → CDN
```

### 3. Core Components
Object storage, job queue, GPU pool, agent API, preview player, rights metadata DB

### 4. Data Flow
Submit job → analyze → propose clips → user selects → render variants → archive masters + outputs

### 5. Agent Interaction
Single agent per project; frame-accurate cuts validated by preview engine

### 6. Scaling Considerations
Chunked processing; parallel renders per output preset; cold vs hot GPU pools

### 7. Failure Handling
Render OOM → lower resolution retry; corrupt source → fail with diagnostics artifact

### 8. Observability
Queue depth, GPU utilization, render minutes, QC rejection reasons
