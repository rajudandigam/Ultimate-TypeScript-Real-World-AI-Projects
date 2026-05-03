# Multi-Agent Incident Response — implementation plan (second flagship)

**Status:** planning only — **no implementation in this commit.**  
**Catalog source of truth:** [`projects/devops/multi-agent-incident-response-system`](../../projects/devops/multi-agent-incident-response-system/README.md) (brief + [`architecture.md`](../../projects/devops/multi-agent-incident-response-system/architecture.md)).  
**Related workspace:** [`packages/core`](../../packages/core/README.md), [`packages/governance`](../../packages/governance/README.md), first flagship [`../ai-cost-monitoring-engine`](../ai-cost-monitoring-engine/README.md) (patterns for audit, cost, harness discipline).  
**Roadmap context:** [`docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md`](../../docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md).

This document is a **build-ready plan**: it names responsibilities, boundaries, modules to add later, and evaluation gates. It does **not** assert compliance (SOC 2, ISO, etc.) or fabricate performance metrics.

---

## 1. Purpose

### What this flagship demonstrates

A **narrow, runnable** slice of the L5 multi-agent incident blueprint: responders get **structured**, **evidence-backed** incident artifacts without granting every agent the same tools or trust level. Concretely, the reference should show:

| Theme | Demonstration intent |
|--------|----------------------|
| **Multi-agent orchestration** | A **supervisor** (deterministic state machine or workflow runner) sequences specialist agents; agents do **not** call each other directly. State is merged into one canonical **incident record**. |
| **Incident triage** | Normalize noisy inputs (duplicate alerts, severity drift) into a **deduped incident view** with initial hypotheses and **query-shaped evidence** (not prose-only “guesses”). |
| **Human-in-the-loop** | **High-impact** steps (mutations, customer-visible comms, elevated paging) stop at an explicit **approval gate** with auditable payloads. |
| **Audit trail** | Every agent step, tool call (mock), approval decision, and state transition is **append-only** and attributable (`actor`, `action`, `resource`, `runId` / `incidentId`). |
| **Runbook execution** | Stages map to **runbook steps** (checklist + optional gated automation placeholders); outputs include **rollback notes** and **risk class** per proposed action. |

### What this flagship is *not*

- Not a replacement for PagerDuty, Slack, Jira, or your observability stack — **mock adapters first**, real OAuth/APIs later.
- Not a proof that multi-agent systems are universally safer — **evaluation** and **gates** carry the safety story.
- Not “263 projects shipped” — one **opinionated** vertical slice aligned to one catalog row.

---

## 2. Agent roles

All LLM-facing roles run behind the **supervisor**; default tool sets are **disjoint** unless explicitly escalated. **Communication Agent** drafts outbound text only; it does not approve sends.

### 2.1 Alert Analyzer Agent

- **Inputs:** Normalized alert(s), dedupe keys, service metadata (mock), recent related incidents (optional stub index).
- **Outputs:** `severity_assessment`, `dedupe_hypothesis`, `initial_queries[]` (templates + parameters), `noise_flags`.
- **Tools (mock):** read incident index; “query” **metrics API** / **logs API** with **strict budgets** (max rows, max time window).
- **Trust:** read-only; no paging mutations.

### 2.2 Root Cause Investigator Agent

- **Inputs:** Analyzer output + **evidence blobs** from approved queries (stored objects, not free text alone).
- **Outputs:** `hypotheses[]` each with `{ claim, confidence, evidence_refs, falsification_checks }`.
- **Tools (mock):** **metrics API**, **logs API**, trace fetch (stub), deployment history (stub).
- **Trust:** read-only; heavier queries require supervisor-enforced caps.

### 2.3 Remediation Planner Agent

- **Inputs:** Investigator hypotheses + service context.
- **Outputs:** `remediation_plan`: ordered steps, each with `{ action_type, description, blast_radius, rollback_notes, requires_approval }`.
- **Tools (mock):** Jira “create draft ticket”; optional **dry-run** command object (no real cluster writes in v1).
- **Trust:** propose-only; **no execution** without gate.

### 2.4 Communication Agent

- **Inputs:** Approved or draft-safe facts from the incident record (supervisor-filtered).
- **Outputs:** `slack_draft`, `status_page_draft`, `pagerduty_update_draft` (structured), **never sent** until approved where policy says so.
- **Tools (mock):** Slack / PagerDuty **draft** endpoints only.
- **Trust:** channel-specific; redact PII per [`@repo/governance`](../../packages/governance/README.md) patterns before logging.

### 2.5 Human Approval Gate

- **Not an LLM** — a **workflow checkpoint** (or explicit UI/CLI prompt in the reference) that records: `decision` (approve / reject / needs_more_evidence), `principal`, `timestamp`, `comment`, `payload_hash` / reference to structured payload.
- **Policies:** e.g. “pager +1 requires two-person approval” can be **stubbed** as a single approver in the demo with clear comments that real orgs need policy engines.
- **Integration:** gate outcomes drive whether mock Jira/Slack/PagerDuty clients **record** a send vs leave draft.

---

## 3. Architecture

### 3.1 Principles (from catalog architecture)

- **Supervisor owns commits** to the incident timeline and external side effects.
- **Append-only evidence** — agents propose; supervisor validates schema and persists.
- **Message passing via supervisor state**, not ad-hoc agent-to-agent chat.
- **Explicit ordering** by default; parallelism only where tools are read-only and budgets allow.

### 3.2 Text diagram (reference v1 target)

```
                    ┌─────────────────────────────┐
  Webhook / CLI ───►│  Incident Ingest + Dedupe   │
                    │  (supervisor: normalize)    │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │  Alert Analyzer Agent       │
                    │  (mock metrics/logs tools)  │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │  Root Cause Investigator    │
                    │  (evidence-linked hypotheses)│
                    └──────────────┬──────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │  Remediation Planner Agent  │
                    │  (plan + rollback notes)    │
                    └──────────────┬──────────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │  Communication Agent        │
                    │  (drafts only in v1)        │
                    └──────────────┬──────────────┘
                                   ▼
              ┌─────────────────────────────────────────┐
              │  Human Approval Gate (non-LLM)          │
              │  approve / reject / request_evidence     │
              └──────────────┬────────────────────────────┘
                             ▼
        ┌────────────────────┴────────────────────┐
        ▼                                         ▼
 ┌──────────────┐                        ┌──────────────────┐
 │ Audit + Cost│                        │ Mock integrations│
 │ (@repo/gov)  │                        │ PD / Slack / Jira  │
 └──────────────┘                        └──────────────────┘
```

### 3.3 Data objects (conceptual, to implement later)

- **`IncidentRecord`:** identity, severity timeline, stage, links to evidence objects.
- **`EvidenceBlob`:** typed payload (metric snapshot ref, log excerpt ref, query spec), producer agent, hash/idempotency key.
- **`AgentTurn`:** prompt version id (stub ok), tool calls, token/cost estimate (via governance cost tracker where LLM calls exist), outcome.
- **`ApprovalRecord`:** gate id, decision, principal, payload reference.

---

## 4. Required modules (files to implement later)

Paths are **suggested** — adjust during implementation if the package layout changes.

```
reference-implementations/multi-agent-incident-response/
  README.md
  architecture.md
  PRODUCTION_GUIDE.md
  package.json
  tsconfig.json
  .env.example
  src/
    index.ts                 # CLI or thin HTTP entry; wires supervisor demo
    types.ts                 # IncidentRecord, EvidenceBlob, stages, enums
    supervisor/
      state-machine.ts       # explicit stages + transitions + timeouts (stub timers ok)
      incident-store.ts      # in-memory v1; interface for Postgres later
    agents/
      alert-analyzer.ts      # role prompt + tool schema + call orchestration
      investigator.ts
      remediation-planner.ts
      communication-agent.ts
    gates/
      human-approval.ts      # records decisions; CLI stub or stdin-based v1
    integrations/
      types.ts               # IntegrationClient interfaces
      mock-pagerduty.ts
      mock-slack.ts
      mock-jira.ts
      mock-logs-api.ts
      mock-metrics-api.ts
    governance/
      audit.ts               # wraps InMemoryAuditLogger + redaction hooks
      cost.ts                # optional LLM call cost rollup per incident
      rate-limit.ts          # InMemoryTokenBucketLimiter per integration id
    runbook/
      templates.ts           # canned runbook fragments + mapping to stages
    report/
      incident-report.ts     # Markdown + JSON export (human + machine)
  tests/
    supervisor.test.ts
    approval-gate.test.ts
    mock-integrations.test.ts
  benchmarks/
    README.md                # pointer to repo benchmarks harness + local suite notes
```

**`@repo/core` touchpoints (planned):** `WorkflowContext`-style trace ids, `runWorkflow` or a thin sequential runner for non-LLM steps, `retryWithBackoff` / `CircuitBreaker` on mock HTTP clients, `createStructuredLogger` for stderr JSON in demos.

**`@repo/governance` touchpoints (planned):** `InMemoryAuditLogger` for audit trail; `calculateCost` if LLM calls are metered; `redactPII` on comms drafts before persistence; `InMemoryTokenBucketLimiter` for integration rate limits; optional `evaluateBudgets`-style policy hints for “page storm” scenarios (stub).

---

## 5. Integrations (mock first)

All integrations are **behind interfaces** (`integrations/types.ts`) with **in-memory** or **fixture-file** responses. No network I/O required for CI.

| System | Mock behavior (v1) | Later real swap |
|--------|--------------------|-----------------|
| **PagerDuty** | Record “incident opened / note appended / escalate draft” events; return synthetic incident ids. | REST v2 with signing + idempotency keys. |
| **Slack** | Capture drafted messages to an array; optional “post” flag only after approval. | Bot token + channel ACLs + block kit validation. |
| **Jira** | Create/update **draft** issue objects in memory; link URLs are fake but stable. | OAuth + project permissions. |
| **Logs API** | Return bounded JSON log slices from canned fixtures keyed by `query_id`. | Loki / Elasticsearch with query guardrails. |
| **Metrics API** | Return time series snippets from fixtures; enforce max points in supervisor. | Prometheus/Mimir with recording rules. |

**Contract tests (later phase):** record/replay HTTP fixtures per integration without blocking the first milestone.

---

## 6. Governance requirements

| Requirement | Reference behavior | Notes |
|-------------|-------------------|--------|
| **Audit trail** | Every stage transition, agent completion, mock tool call, and approval writes an `AuditEvent` (`runId`/`incidentId`, `actor`, `action`, `resource`, `metadata`). | Use `@repo/governance` patterns; durable store deferred. |
| **Cost tracking** | If LLM calls exist: log **token estimates** per agent turn and roll up per incident using the same **configurable pricing** idea as the cost flagship. | If v1 is **deterministic stub** (no LLM), still document hooks and keep cost fields zero with explicit `mode: "stub"`. |
| **Approval logging** | Immutable `ApprovalRecord` entries; rejections must capture reason. | Tie to gate id; never overwrite. |
| **Rate limits** | Per-`integrationId` and per-`incidentId` token buckets for mock logs/metrics calls. | Prevents “agent loop hammers fixture API” even in demo. |
| **Rollback notes** | Remediation planner **must** attach `rollback_notes` for each mutating-class step (even when execution is disabled). | Supervisor rejects plans missing rollback for high-risk classes. |

**Honesty bar:** document in README that governance packages are **patterns**, not certifications (mirror `@repo/governance` disclaimer).

---

## 7. Evaluation plan

Evaluations are **scenario-driven** on **synthetic incidents** first; metrics are **diagnostic**, not marketing.

| Metric | Definition | How to measure (reference) |
|--------|------------|---------------------------|
| **Detection quality** | Do analyzer + investigator surface the **seeded** root cause in top-k hypotheses with **cited evidence**? | Golden scenarios with known `expected_hypothesis_id` / required evidence keys; automated structural checks (not LLM-judge in v1 unless explicitly added). |
| **Time-to-summary** | Wall time from ingest to **first** `IncidentSummary` artifact meeting schema completeness. | Harness timestamps in CLI/CI; report p50/p95 across N runs on same machine (see repo [`benchmarks/`](../../benchmarks/README.md) methodology — no cross-machine claims). |
| **False escalation rate** | Fraction of scenarios where mock PagerDuty receives an **escalate** without human approval when policy requires approval. | Assert mock client call counts vs gate state; include “near-miss” scenarios. |
| **Remediation safety** | Plans with mutating `action_type` must include `rollback_notes`, `requires_approval=true`, and pass static deny-lists (e.g. no raw shell from string concat). | Unit tests on planner output schema + supervisor validation. |

**Human spot checks:** maintain a short `EVAL.md` checklist for maintainers (5–10 minutes per release) until golden sets mature.

---

## 8. Implementation phases

Three **small** phases; each ends with **runnable** behavior and **tests**, mirroring the first flagship’s discipline.

### Phase A — Mock incident ingest

**Goal:** Create `IncidentRecord` from webhook/CLI payload, dedupe, persist in memory, emit audit events, seed mock metrics/logs fixtures.

**Exit criteria**

- `incident-store` CRUD + idempotency on duplicate webhook delivery.
- `mock-metrics-api` / `mock-logs-api` return deterministic slices for a known `incidentId`.
- `tests/supervisor.test.ts` covers ingest + dedupe.

### Phase B — Agent coordination

**Goal:** Wire Alert Analyzer → Investigator → Planner **sequentially** under supervisor; each step writes structured outputs + evidence refs; rate limits enforced.

**Exit criteria**

- Schema validation (Zod recommended) at each handoff boundary.
- No integration sends without passing through supervisor commit API.
- `tests/mock-integrations.test.ts` proves caps and “no call before stage” invariants.

### Phase C — Report + approval flow

**Goal:** Communication drafts + **Human Approval Gate** + final `incident-report` (Markdown + JSON); mock Slack/PagerDuty/Jira record **only approved** actions.

**Exit criteria**

- `tests/approval-gate.test.ts` for approve/reject/needs_more_evidence paths.
- README “how to run” + honest limitations + link to catalog blueprint.
- Optional: suite under repo [`benchmarks/suites/`](../../benchmarks/README.md) for ingest→summary latency (local only).

---

## Appendix A — Open decisions (capture before coding)

- **LLM vs deterministic v1:** smallest risk is **deterministic / scripted agent outputs** with LLM introduced behind a feature flag once schemas stabilize.
- **Temporal vs in-process state machine:** Temporal matches L5 blueprint; for parity with first flagship footprint, **in-process state machine** first, document migration path in `PRODUCTION_GUIDE.md` when added.
- **UI vs CLI:** CLI-first matches “runnable without frontend”; optional minimal web later.

---

## Appendix B — Success definition for “second flagship done”

- A new contributor can **clone, install, run** the reference and complete a **golden incident** path in under 10 minutes (documented).
- The catalog blueprint’s **core story** (multi-agent separation, supervisor merges, human gate, audit) is **visible in code structure**, not only in prose.
- No README claims **compliance**, **SLA**, or **benchmark superiority** without controlled evidence.
