### 1. System Overview
**Proxy** terminates TLS at edge (or taps via vendor API). **Workflow engine** orchestrates detector stages with deadlines. **Decision store** powers appeals and model rollback.

### 2. Architecture Diagram (text-based)
```
Video → sampler → detector pool → fusion → policy
                         ↓
              allow / flag / block + audit export
```

### 3. Core Components
Model registry with signed artifacts, GPU autoscaler, rate limiter, human review workbench, SIEM exporter, content ID cache

### 4. Data Flow
Select frames/audio segments → run detectors in parallel with timeouts → merge scores via learned or fixed fusion → apply policy thresholds per tenant tier → emit structured incident

### 5. Agent Interaction
No LLM on hot path by default; optional analyst assistant reads incident JSON only

### 6. Scaling Strategy
Shard by stream; adaptive sampling under load; separate pools for liveness vs long-form VOD; preemptible GPUs for batch

### 7. Failure Modes
Detector timeout → fail open vs closed per policy; model version mismatch; drift under new iPhone camera pipeline—shadow scoring, automatic rollback triggers

### 8. Observability Considerations
Added latency histograms, GPU utilization, score distributions, human override rate, adversarial sample bucket growth
