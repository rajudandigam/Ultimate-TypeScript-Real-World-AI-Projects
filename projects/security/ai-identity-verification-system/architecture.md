### 1. System Overview

Clients start a **verification session** with a **session token**. **Mobile/web SDK** captures doc + selfie per policy. **Workflow** orchestrates vendor checks, aggregates **risk scores**, applies **policy rules**, and issues a **signed verification result** consumable by downstream services (e.g., passkeys enrollment, wire transfer).

---

### 2. Architecture Diagram (text-based)

```
Client SDK
        ↓
   Verification API
        ↓
   Identity workflow (Temporal/Inngest)
   ↓     ↓      ↓      ↓
 doc  liveness match  risk
        ↓
   Decision + audit
        ↓
   Webhook to relying party
```

---

### 3. Core Components

- **UI / API Layer:** Capture UX, status polling, support tooling.
- **LLM layer:** Optional localized guidance copy generation from error codes (non-authoritative).
- **Agents (if any):** None on critical path by default.
- **Tools / Integrations:** Identity vendors, device attestation, watchlists, SIEM.
- **Memory / RAG:** Fraud playbooks for analysts (RBAC); not end-user biometrics.
- **Data sources:** User submissions, device telemetry (minimized), third-party risk signals.

---

### 4. Data Flow

1. **Input:** Start session; collect doc images/video per flow type.
2. **Processing:** Run vendor checks in order; aggregate scores; apply policy matrix.
3. **Tool usage:** Internal admin tools for replay (authorized), case export (redacted).
4. **Output:** Signed JWT or opaque token with claims; or rejection with safe codes.

---

### 5. Agent Interaction (if applicable)

Optional **analyst copilot** reads structured case JSON in separate service; never on user hot path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async workers for vendor calls; regional deployments for data residency.
- **Caching:** Vendor result caching keyed by session id only (short TTL); never cross-user cache biometrics.
- **Async processing:** Large uploads and vendor async callbacks.

---

### 7. Failure Handling

- **Retries:** Vendor retries with backoff; user-friendly retry for network failures.
- **Fallbacks:** Alternate flow (different doc type) if primary fails; manual review queue.
- **Validation:** Reject malformed captures early with client-side quality hints to reduce costs.

---

### 8. Observability

- **Logging:** Decision codes, vendor latency, session outcomes (metadata-first).
- **Tracing:** Trace `session_id` across workflow with strict redaction policies.
- **Metrics:** Completion rate, vendor error rate, review queue depth, attack attempt proxies, cost per verification.
