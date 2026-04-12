### 1. System Overview

The protocol defines **envelope schemas** and **authorization tokens**. A **broker cluster** stores and forwards messages with durability settings per topic. **SDKs** in TypeScript wrap serialization, retries, and trace propagation. **Policy service** evaluates each publish/subscribe against RBAC and tenant boundaries.

---

### 2. Architecture Diagram (text-based)

```
Agent A (SDK) --publish--> Broker (durable log)
                              ↓
                         Policy service (allow/deny)
                              ↓
Agent B (SDK) <--deliver-- consumer group
        ↓
   reply envelope (optional RPC)
```

---

### 3. Core Components

- **UI / API Layer:** Admin console for ACLs, topic lifecycle, replay controls.
- **LLM layer:** None in broker path.
- **Agents (if any):** External clients using SDK.
- **Tools / Integrations:** Identity provider, KMS, SIEM exporters.
- **Memory / RAG:** Optional retained store with TTL; not a general-purpose chat log.
- **Data sources:** ACL tables, schema registry, consumer offset metadata.

---

### 4. Data Flow

1. **Input:** Agent publishes envelope with `tenant_id`, `capability_token`, `schema_version`, `payload_ref`.
2. **Processing:** Broker authenticates; policy engine evaluates; serialize to partition key; append log.
3. **Tool usage:** Consumers ack/process; on failure, redeliver until DLQ threshold; replay tool for support with audit.
4. **Output:** Delivery to subscribers; metrics updated; traces linked via `correlation_id`.

---

### 5. Agent Interaction (if applicable)

Agents interact **only** through the protocol. Supervisors can enforce **allowed graph edges** by issuing capability tokens scoped to pairs `(producer_role, consumer_role)`.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by tenant or topic; separate control plane; read replicas for ACL lookups.
- **Caching:** Schema registry cache; negative cache for denied publishers (short TTL, careful abuse handling).
- **Async processing:** Compaction jobs for old partitions; async DLQ triage workflows.

---

### 7. Failure Handling

- **Retries:** Consumer-controlled redelivery; broker-level redelivery limits; idempotent handlers required by contract.
- **Fallbacks:** Secondary region failover with fenced writes and documented RPO/RTO.
- **Validation:** Reject unknown schema versions; quarantine oversized payloads.

---

### 8. Observability

- **Logging:** AuthZ decisions, delivery latency, DLQ reasons (metadata only).
- **Tracing:** Inject trace context on publish; continue on consume; measure cross-agent hop latency.
- **Metrics:** Publish rate, consumer lag, schema mismatch count, token verification failures.
