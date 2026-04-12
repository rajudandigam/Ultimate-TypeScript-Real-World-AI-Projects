### 1. System Overview

**PEP** gateways wrap tool execution: every call requests a **decision** from **PDP** with structured attributes. PDP evaluates **Rego/Cel/Zanzibar** policies loaded from git-backed bundles. **Audit** sink records allow/deny with hashes of args. **JIT** grants stored in Redis with TTL for elevated sessions.

---

### 2. Architecture Diagram (text-based)

```
Agent runtime (PEP)
        ↓ decision request
   PDP cluster (stateless)
        ↓
   Policy bundle registry + relationship DB
        ↓
   Decision + obligations → PEP enforces (execute or block)
        ↓
   Audit / SIEM
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor with CI, access review UI, emergency revoke console.
- **LLM layer:** None on hot path.
- **Agents (if any):** External; must use PEP SDK.
- **Tools / Integrations:** IdP, ITSM for approvals, KMS for signing.
- **Memory / RAG:** Optional human-facing policy docs retrieval—not PDP cache of decisions beyond TTL.
- **Data sources:** Policy bundles, relationship tuples, audit warehouse.

---

### 4. Data Flow

1. **Input:** PEP builds decision request with principal claims, tool id, resource id, environment, payload hash.
2. **Processing:** PDP loads compiled policy version; evaluates; may require step-up token presence.
3. **Tool usage:** If allow with obligations, PEP attaches scoped short-lived credential to downstream tool host.
4. **Output:** Return decision to caller; async write audit; emit metrics.

---

### 5. Agent Interaction (if applicable)

Agents are **clients** of permissioning. Multi-agent systems must pass the same **correlation id** so cross-agent tool calls remain auditable.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless PDP pods behind load balancer; warm policy caches; read replicas for relationship DB.
- **Caching:** Decision cache keyed by `(principal_hash, tool, resource, policy_version)` with very short TTL for high-risk tools disabled.
- **Async processing:** Policy bundle rollout with canary percentage and automatic rollback hooks.

---

### 7. Failure Handling

- **Retries:** Idempotent decision RPCs; fail-closed for high risk on PDP outage if configured.
- **Fallbacks:** Degraded mode with reduced tool surface explicitly advertised to operators.
- **Validation:** Reject policies failing CI tests; reject tool manifests missing risk classification.

---

### 8. Observability

- **Logging:** Allow/deny codes, policy version, latency; avoid raw secrets.
- **Tracing:** Span around PDP call from tool invocation span.
- **Metrics:** Deny spikes, cache hit rate, break-glass usage, PDP error rate.
