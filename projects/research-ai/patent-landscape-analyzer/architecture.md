### 1. System Overview
**Corpus indexer** maintains public and (optional) private corpora in isolated indices. **Agent BFF** enforces per-matter ACLs. **Exporter** builds counsel-ready bundles.

### 2. Architecture Diagram (text-based)
```
Seed → landscape agent → search / cluster tools
                 ↓
          evidence tables → review UI → export
```

### 3. Core Components
CPC taxonomy service, deduplication by family ID, citation linker, watch scheduler, billing meter for API units

### 4. Data Flow
Parse seed → expand query plan → execute parallel searches → dedupe → cluster embeddings + metadata → rank gaps → attach references → freeze snapshot ID

### 5. Agent Interaction
Private index tool cannot be called from public matter sessions; cross-leak tests in CI

### 6. Scaling Strategy
Shard index by jurisdiction; approximate nearest neighbor with quantization; async export jobs for large corpora

### 7. Failure Modes
API rate limits mid-job; inconsistent family IDs; OCR noise in old scans—checkpointing, human OCR correction queue

### 8. Observability Considerations
Recall proxy metrics, latency per stage, API $ per report, user redline frequency on narratives
