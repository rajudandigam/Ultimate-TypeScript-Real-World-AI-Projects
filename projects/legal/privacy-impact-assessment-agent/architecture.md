### 1. System Overview

**Intake service** captures structured answers. **Metadata tools** fetch **service catalog**, **data stores**, and **vendor records**. **PIA Agent** assembles **section JSON** with citations to sources. **Review workflow** routes to privacy counsel; on approval, **document service** renders versioned PDF/DOCX and stores immutable hash.

---

### 2. Architecture Diagram (text-based)

```
Intake → PIA Agent → internal tools (catalog, IAM, vendors)
        ↓
Draft sections → counsel review → signed artifact
```

---

### 3. Core Components

- **UI / API Layer:** Wizard, diff across versions, approval inbox.
- **LLM layer:** Tool-using agent with strict schema per section.
- **Agents (if any):** Single drafting agent; optional security addendum agent.
- **Tools / Integrations:** Backstage/ServiceNow, cloud asset inventory (read-only), HRIS for DPIA roles (scoped).
- **Memory / RAG:** Policy library embeddings; prior assessments (ACL).
- **Data sources:** RoPA tables, DPIA templates, architecture docs.

---

### 4. Data Flow

1. **Input:** Create `assessment_id` with product/feature scope.
2. **Processing:** Agent asks minimal clarifiers; fetches tool facts in parallel where safe.
3. **Tool usage:** Validate vendor names against approved registry; flag unknowns.
4. **Output:** Persist draft version; notify counsel; block “submitted” until signatures.

---

### 5. Agent Interaction (if applicable)

Single primary agent; counsel edits are authoritative and versioned.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async tool calls with per-tool concurrency caps.
- **Caching:** Catalog snapshots per day for stable drafts.
- **Async processing:** Large IAM/policy attachments parsed in background jobs.

---

### 7. Failure Handling

- **Retries:** Tool backoff; partial draft mode with explicit TODOs.
- **Fallbacks:** If model unavailable, export questionnaire answers only.
- **Validation:** Enforce required sections and max length per section to avoid runaway prose.

---

### 8. Observability

- **Logging:** Tool success/fail, section completion times, redaction counts.
- **Tracing:** Intake→draft spans per assessment.
- **Metrics:** Time-to-approval, reopen count post-launch, counsel override taxonomy.
