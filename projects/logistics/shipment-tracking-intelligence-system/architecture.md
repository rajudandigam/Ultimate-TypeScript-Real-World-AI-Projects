### 1. System Overview
**Webhook/collector** writes **canonical tracking events**. **Workflow** advances shipment state. **Detector** flags risk vs SLA. **Notifier** sends customer updates via ESP/ticket APIs.

### 2. Architecture Diagram (text-based)
```
Carriers → normalize → shipment graph
        ↓
SLA rules → alerts → CS/customer channels
```

### 3. Core Components
Connector registry, event deduper, rules engine, notification service, admin replay tool, observability stack

### 4. Data Flow
Receive event → validate sequence → update ETA projection → if threshold crossed enqueue comms + tasks

### 5. Agent Interaction
Optional LLM for templated customer copy from `delay_code` enum only

### 6. Scaling Considerations
High-volume peak season sharding; backpressure on outbound comms; DLQ for poison payloads

### 7. Failure Handling
Out-of-order events → reorder buffer; unknown SCAC → manual mapping queue

### 8. Observability
Ingest lag, alert precision (human labels), comms delivery metrics, refund correlation
