### 1. System Overview
**Workflow** coordinates **extract audio → ASR → align → export captions → optional burn-in render**. **QC** routes low-confidence spans to editors. **Publisher** attaches sidecars to video CMS.

### 2. Architecture Diagram (text-based)
```
Media → audio extract → ASR → align
        ↓
SRT/VTT → QC → publish/burn-in
```

### 3. Core Components
Transcode cluster, ASR service, alignment lib, glossary service, editor UI, CDN invalidation hooks

### 4. Data Flow
Register asset → enqueue job → write captions artifact with version → link to video id → notify downstream players

### 5. Agent Interaction
Optional LLM post-edit within max char delta per line; primary path deterministic

### 6. Scaling Considerations
Spot instances for burst; chunk long files; parallel language tracks

### 7. Failure Handling
Partial failure → resume from last checkpoint; never publish empty sidecar silently

### 8. Observability
WER proxies, QC pass rate, queue latency, GPU hours per hour of content
