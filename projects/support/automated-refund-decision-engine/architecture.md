### 1. System Overview

**Request API** ingests refund intents with **idempotency keys**. **Decision workflow** loads **order facts**, **fraud features**, and **policy pack version**. **Router** auto-executes, denies, or enqueues **human review**. **Payment adapter** performs refunds; **ledger** records outcomes for finance reconciliation.

---

### 2. Architecture Diagram (text-based)

```
Refund request → policy workflow → risk + rules
        ↓
Auto path → payment API          Manual path → agent queue
        ↓
Ledger + notifications
```

---

### 3. Core Components

- **UI / API Layer:** Ops console, policy editor with simulation, audit export.
- **LLM layer:** Optional note generator for humans; not on payment path.
- **Agents (if any):** Optional read-only investigator later.
- **Tools / Integrations:** OMS, payments, fraud vendors, helpdesk linking.
- **Memory / RDB:** Case state, idempotency store, policy versions.
- **Data sources:** Orders, shipments, usage meters, promo history.

---

### 4. Data Flow

1. **Input:** Validate schema; attach `request_id` for dedupe.
2. **Processing:** Evaluate rule tree; compute risk tier; attach evidence bundle.
3. **Tool usage:** If auto-approved, call refund API with idempotency; await webhook confirmation.
4. **Output:** Update ticket; notify customer template; post ledger row.

---

### 5. Agent Interaction (if applicable)

No LLM on execution path in v1; optional assist for human reviewers only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by merchant; async for webhook-driven completion.
- **Caching:** Policy packs in memory with versioned ETags.
- **Async processing:** Nightly reconciliation with payment provider statements.

---

### 7. Failure Handling

- **Retries:** Only safe retries with idempotency keys; poison messages to DLQ with case link.
- **Fallbacks:** If provider ambiguous, mark **manual_reconcile** state, never double-pay.
- **Validation:** Currency and amount checks against order line items; rounding rules explicit.

---

### 8. Observability

- **Logging:** Decision codes, payment intent ids (non-PCI), rule pack version.
- **Tracing:** Request→decision→provider span.
- **Metrics:** Auto-approve %, $ exposure, reversal counts, queue SLA.
