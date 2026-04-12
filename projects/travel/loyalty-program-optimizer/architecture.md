### 1. System Overview

**Connectors** ingest balances and transactions into a **normalized ledger**. A **scoring service** computes candidate redemption paths using **versioned valuation tables**. The **optimizer agent** reads scored JSON and answers follow-ups via tools (`recompute`, `fetch_program_rules`). **Notification worker** handles expiries.

---

### 2. Architecture Diagram (text-based)

```
User / imports
        ↓
   Connector layer → normalized balances (Postgres)
        ↓
   Scoring + path finder (TypeScript)
        ↓
   Optimizer Agent (explain + what-if tools)
        ↓
   UI + alerts
```

---

### 3. Core Components

- **UI / API Layer:** Dashboard, assumptions editor, disclaimers.
- **LLM layer:** Thin explanation agent over structured optimizer output.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Partner APIs, CSV parsers, calendar for expiries.
- **Memory / RAG:** Optional FAQ retrieval for program quirks.
- **Data sources:** User-linked accounts, static award charts, bonus calendars.

---

### 4. Data Flow

1. **Input:** User triggers refresh or changes trip goal fields.
2. **Processing:** Fetch balances; build graph of transfer + burn options; score paths.
3. **Tool usage:** Agent may request recomputation with different CPP assumptions only via validated parameters.
4. **Output:** Render ranked list with citations to table versions and fetched balances timestamps.

---

### 5. Agent Interaction (if applicable)

Single agent. Batch jobs recompute nightly without conversational turns.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; queue connector jobs per user.
- **Caching:** Balance snapshots with TTL; immutable valuation table versions.
- **Async processing:** Heavy award-space searches (if added) as background jobs.

---

### 7. Failure Handling

- **Retries:** Per-connector retries; partial results with clear “stale program X” banners.
- **Fallbacks:** Read-only mode if LLM down; numeric results still usable.
- **Validation:** Reject optimizer inputs outside sane bounds (negative CPP, etc.).

---

### 8. Observability

- **Logging:** Connector success/fail, table version used, recomputation reasons.
- **Tracing:** Trace `user_id` refresh jobs end-to-end (PII-minimized).
- **Metrics:** Refresh success rate, time-to-first plan, user override rate, support tickets about wrong balances.
