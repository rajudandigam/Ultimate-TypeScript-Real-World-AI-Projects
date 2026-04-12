### 1. System Overview

The engine sits on the **request path** as middleware or sidecar: **normalize** payload → **evaluate rules** (OPA/CEL) → optional **classifier** → **decision** → forward or block. Policy definitions are **git-versioned** artifacts loaded into memory with hot reload and audit trails.

---

### 2. Architecture Diagram (text-based)

```
Client → LLM app
        ↓
   Guardrail sidecar / SDK hook
   ├─ Schema + regex (fast)
   ├─ OPA policies (deterministic)
   ├─ Classifier model (optional)
   └─ Escalation / masking actions
        ↓
   Allow / mask / block → downstream model or client error
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor UI, simulation console, audit search for security.
- **LLM layer:** Optional classifier models; separate from business LLM.
- **Agents (if any):** None on critical path by default.
- **Tools / Integrations:** Ticketing, SIEM, URL scanners (allowlisted).
- **Memory / RAG:** Policy text retrieval for explainability to admins.
- **Data sources:** Published policy bundles, red-team test suites, org risk tiers.

---

### 4. Data Flow

1. **Input:** Intercept request/response; attach `policy_version`, `tenant_id`, `surface`.
2. **Processing:** Run compiled rule graph; short-circuit on hard blocks; optionally call classifier with timeout.
3. **Tool usage:** On escalate, open ticket with hashed excerpt references—not raw secrets.
4. **Output:** Return decision + optional masked text; emit OTel span with decision tags.

---

### 5. Agent Interaction (if applicable)

Classifier is a **model service**, not a conversational agent. Optional “explainer” runs **offline** for admins.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless sidecars; local policy cache; regional policy CDNs for read-heavy configs.
- **Caching:** Compiled policy artifacts; embedding cache for policy clauses (admin-only).
- **Async processing:** Heavy red-team replay jobs offline.

---

### 7. Failure Handling

- **Retries:** Classifier transient errors → fail according to configured posture (closed/open).
- **Fallbacks:** Degrade to rules-only if classifier unhealthy (explicit metric).
- **Validation:** Reject policy bundles failing CI signature or schema.

---

### 8. Observability

- **Logging:** Decision codes, policy version, latency per stage; PII-aware redaction.
- **Tracing:** Child spans for each policy stage under request span.
- **Metrics:** Block/mask/allow rates, classifier timeout rate, appeals overturn rate.
