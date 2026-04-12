### 1. System Overview
**Ingress adapters** normalize events. **Classifier ensemble** produces scores + spans. **Agent** composes **human-readable rationales** and chooses **workflow branch** (block, warn, encrypt, allow with log).

### 2. Architecture Diagram (text-based)
```
Channel event → normalize → detectors → scores
                    ↓
            DLP agent → policy router → action + audit
```

### 3. Core Components
Mail/chat connectors, content store (short TTL), KMS integration, policy DSL, review UI, SIEM exporter, model hosting (optional on-prem)

### 4. Data Flow
Extract text/attachments → run detectors in parallel → merge via policy weights → write decision record → notify user with safe excerpt only

### 5. Agent Interaction
Agent reads **redacted** spans + metadata; cannot request full raw payload without elevated token + reason code

### 6. Scaling Challenges
High-volume mail spools; large attachments; multilingual tokenization costs

### 7. Failure Handling
Detector timeout → fail closed or open per policy tier; partial parse → quarantine with reason

### 8. Observability Considerations
Block/allow rates per policy version, detector latency, appeal outcomes, drift monitors on classifier versions, leakage attempt patterns
