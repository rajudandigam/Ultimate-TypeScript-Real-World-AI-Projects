### 1. System Overview
**Video ingress** fans out to **stateless GPU workers**. **Workflow engine** owns retries, idempotency keys per track+rule hit, and **retention policies** (e.g., 30-day clip TTL).

### 2. Architecture Diagram (text-based)
```
Cameras → decode → detect/track → policy engine → alerts
                         ↓
                 evidence store → EHS / CMMS
```

### 3. Core Components
VMS adapter layer, model registry with signed artifacts, geofence editor UI, RBAC (supervisor vs auditor), audit log immutable store

### 4. Data Flow
Frame batch → tensor preprocess → inference → NMS + tracking → map feet to floor plan coords → evaluate zone rules → if breach, open incident with clip bounds

### 5. Agent Interaction
No conversational agent on hot path; optional offline assistant summarizes incidents for weekly safety standups

### 6. Scaling Considerations
Hundreds of 1080p30 streams: edge pre-infer vs central; dynamic batching; separate clusters per site; backpressure when GPU pool saturated

### 7. Failure Modes
GPU OOM → drop to lower res tier; clock skew breaks sync replay—PTP monitoring; model hot-swap regression—canary cameras per version

### 8. Observability Considerations
End-to-end latency, per-rule alert rate, GPU utilization, false positive override tags, storage egress costs
