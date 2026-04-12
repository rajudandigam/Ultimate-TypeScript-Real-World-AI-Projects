### 1. System Overview
**Ingest** stores episode audio. **Workflow** coordinates ASR, NLP scoring, and render DAG. **QC UI** gates publish. **Metrics** tie clips to downstream analytics.

### 2. Architecture Diagram (text-based)
```
Audio → ASR → highlight scorer → snippet specs
                    ↓
           QC → FFmpeg farm → CDN → social APIs
```

### 3. Core Components
Object storage, GPU pool, template registry, caption style engine, rights metadata DB, webhook callbacks

### 4. Data Flow
Episode ID → transcribe with diarization → rank candidate windows → dedupe overlapping → generate vertical crop metadata → render → upload → store platform asset IDs

### 5. Agent Interaction
Optional LLM step consumes only transcript excerpts + scores; cannot change crop geometry validated by preview engine

### 6. Scaling Strategy
Chunk long episodes; parallel renders per output preset; spot/preemptible instances; isolate noisy neighbors on shared GPU nodes

### 7. Failure Modes
Render OOM on 4K sources; API quota exceeded mid-upload; partial QC approval—retry with downscale profile, idempotent upload keys

### 8. Observability Considerations
Queue depth, GPU minutes per episode, QC rejection taxonomy, publish success rate, $ per published clip
