### 1. System Overview
**Ingest API** stores encrypted images. **Model ensemble** produces logits. **Agent** composes narrative grounded in retrieval hits and tool-verified product lists.

### 2. Architecture Diagram (text-based)
```
Image → vision models → diagnostic agent → RAG / chem tools
                         ↓
               structured report → advisor UI
```

### 3. Core Components
Moderation filter, duplicate case detector, label parser, audit trail, export to PDF for insurance claims (optional)

### 4. Data Flow
Upload → virus scan → run primary classifier → if low confidence → agent asks targeted photo prompts → merge evidence → output

### 5. Agent Interaction
No direct purchase links without partner policy; temperature low for factual fields; refusal templates for illegal advice requests

### 6. Scaling Strategy
GPU autoscaling burst at season peaks; CDN for thumbnails; shard vector index by crop and region

### 7. Failure Modes
Out-of-distribution crops; night flash artifacts; multilingual farmer notes mis-parsed—OOD detector, metadata prompts, human translation path

### 8. Observability Considerations
Inference latency, GPU saturation, retrieval miss rate, escalation rate to humans, post-treatment outcome capture rate
