### 1. System Overview

The registry is a **control plane** in front of MCP tool servers. Clients (IDE agents, web copilots, batch workers) speak MCP to a **router proxy** that authenticates the caller, evaluates **OPA policies**, attaches **scoped credentials**, executes the tool in a **sandbox runner** when needed, and writes an **audit event**. Optional LLM agents assist humans with **discovery and documentation**, not runtime authorization.

---

### 2. Architecture Diagram (text-based)

```
Client (Copilot / IDE / service agent)
        ↓ MCP
   Registry Router (authN/Z + quotas)
        ↓
┌─────────────────────────────────────────────┐
│ Tool runners (isolated) → MCP servers       │
└─────────────────────────────────────────────┘
        ↑
   Policy engine (OPA) ←── Admin policy repo
        ↑
   Optional: Discovery Agent (read-only registry tools)
        ↑
   Optional: Policy Explainer Agent (read-only)
        ↓
   Audit store + SIEM export
```

---

### 3. Core Components

- **UI / API Layer:** Admin console, developer portal, approval workflows for new tools.
- **LLM layer:** Optional agents for docs/schema assistance; never the sole authorizer.
- **Agents (if any):** Discovery/explainer agents (optional); client agents remain external.
- **Tools / Integrations:** MCP servers for SaaS systems; OAuth brokers; secret stores.
- **Memory / RAG:** Tool documentation index; policy rationale snippets (non-authoritative).
- **Data sources:** Published tool manifests, OpenAPI imports, ownership metadata from CMDB.

---

### 4. Data Flow

1. **Input:** Client sends MCP request with session principal and requested tool/version.
2. **Processing:** Router resolves manifest, evaluates policy with context (tenant, risk class, scopes).
3. **Tool usage:** On allow, proxy invokes runner with injected short-lived token; stream results back with size caps.
4. **Output:** Response to client + audit record + metrics increment; deny returns typed error with remediation hint.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Discovery agent helps humans find tools; explainer agent summarizes policy decisions using logs (read-only). **Communication:** both read through registry APIs, never bypass router. **Orchestration:** humans approve risky publishes; automated systems handle routine health checks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless routers; scale runners per tool pool; isolate noisy tools.
- **Caching:** Manifest cache with ETags; negative caching for denies cautiously (short TTL).
- **Async processing:** Heavy OpenAPI imports and test harness runs as background jobs.

---

### 7. Failure Handling

- **Retries:** Safe retries on transient runner failures; no duplicate side effects without idempotency keys.
- **Fallbacks:** If discovery LLM down, UI falls back to keyword search on manifests.
- **Validation:** Strict JSON Schema validation; reject unknown tool versions unless explicitly allowlisted.

---

### 8. Observability

- **Logging:** Structured audit events exported to SIEM; separate debug logs without secrets.
- **Tracing:** Trace router → runner → downstream MCP with shared `trace_id`.
- **Metrics:** Allow/deny rates, per-tool latency/error SLOs, hot tools, unusual cross-tool call sequences.
