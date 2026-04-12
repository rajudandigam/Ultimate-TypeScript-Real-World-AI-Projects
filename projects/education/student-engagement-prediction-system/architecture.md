### 1. System Overview

**ETL workflows** land LMS/SIS events into a **warehouse**. **Feature builder** materializes per-student daily/weekly metrics. **Scoring workflow** applies **model vN** or rules to assign **tiers**. **Notification workflow** enqueues advisor tasks with **audit** entries.

---

### 2. Architecture Diagram (text-based)

```
LMS/SIS exports → warehouse → features
        ↓
Scoring job → risk tiers → advisor queue
```

---

### 3. Core Components

- **UI / API Layer:** Advisor UI, threshold admin, appeals log.
- **LLM layer:** Optional outreach templating from structured drivers only.
- **Agents (if any):** Optional later; core is workflow/ML.
- **Tools / Integrations:** LMS APIs, email/SMS with consent registry, CRM.
- **Memory / RDB:** Feature tables, model registry, notification ledger.
- **Data sources:** Assignments, grades, attendance, clicks (policy scoped).

---

### 4. Data Flow

1. **Input:** Incremental event files or API pulls with cursor checkpoints.
2. **Processing:** Normalize student ids; join to active enrollments only.
3. **Tool usage:** Score; attach top 3 drivers from explainability module.
4. **Output:** Upsert `student_risk_snapshot`; emit advisor notifications per cadence rules.

---

### 5. Agent Interaction (if applicable)

Optional templating agent; tier assignment remains deterministic/ML outside LLM unless explicitly designed otherwise.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ETL by term and campus; async scoring workers.
- **Caching:** Enrollment snapshots reused across scoring and UI.
- **Async processing:** Nightly batch with intraday optional micro-batch for pilot programs.

---

### 7. Failure Handling

- **Retries:** File ingest retries; quarantine malformed rows with alerts.
- **Fallbacks:** If model unavailable, fall back to rules-only tier with banner in UI.
- **Validation:** Reject scores for students without valid FERPA basis for processing.

---

### 8. Observability

- **Logging:** Model version, feature build version, join completeness %.
- **Tracing:** ETL→score→notify spans per batch id.
- **Metrics:** Tier distribution drift, intervention uptake, false positive advisor reports.
