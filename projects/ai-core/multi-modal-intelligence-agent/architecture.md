### 1. System Overview
**Ingress** stores blobs temporarily. **Preprocessor** extracts modality-specific tensors/text. **Agent runtime** selects tools and assembles a **bounded context**. **Postprocessor** validates JSON schema outputs.

### 2. Architecture Diagram (text-based)
```
Media → normalize → router → multimodal agent → tools
                              ↓
                     structured answer + citations
```

### 3. Core Components
Object storage, virus scanner, transcoder pool, model router, schema validator, rate limiter, abuse detector

### 4. Data Flow
Upload → metadata extract → route plan → parallel tool calls where safe → merge results under token budget → respond

### 5. Agent Interaction
Single agent thread; tools are idempotent where possible; vision tool cannot access arbitrary URLs without allowlist

### 6. Scaling Challenges
Large video fan-out; cold start of GPU workers; skewed popularity of certain templates

### 7. Failure Handling
ASR failure → return image-only analysis with disclaimer; tool timeout → partial answer with explicit gaps

### 8. Observability Considerations
Per-modality latency, tool error rates, GPU utilization, content policy triggers, storage egress costs
