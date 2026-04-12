### 1. System Overview
**Ingest plane** validates device payloads and writes **canonical observations**. **Feature workers** compute windows. **RPM Agent** consumes recent windows + **care plan snapshot** and returns **structured triage objects**.

### 2. Architecture Diagram (text-based)
```
Devices → ingest → TSDB → feature windows → RPM agent
                              ↓
                    escalation workflow → EHR/messaging
```

### 3. Core Components
Device registry, identity service, rules engine (hard stops), agent BFF, on-call roster integration, PHI-safe log redactor

### 4. Data Flow
Vital batch → dedupe by device clock skew → merge with patient context → score severity → suppress duplicates within cooldown → notify with deep link to trend chart

### 5. Agent Interaction
Agent tools are parameterized queries only; cannot change care plan; narratives must reference observation IDs

### 6. Scaling Challenges
Burst traffic from firmware bugs; hot patients with dense streams; multi-tenant noisy neighbor isolation

### 7. Failure Handling
Late data → recompute windows idempotently; agent timeout → fall back to rule-based severity; never page on empty context

### 8. Observability Considerations
End-to-end ingest lag, suppression counts, escalation latency, false alarm rate by device model, GPU/LLM cost per thousand vitals (if used)
