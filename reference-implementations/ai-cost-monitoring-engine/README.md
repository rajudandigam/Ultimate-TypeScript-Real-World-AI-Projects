# AI Cost Monitoring Engine (reference implementation)

Runnable slice aligned with the catalog blueprint  
[`projects/devtools/ai-cost-monitoring-engine`](../../projects/devtools/ai-cost-monitoring-engine/)  
— **this folder is new code**; the catalog path remains the authoritative product brief.

## What this demonstrates

- **Usage ingestion** with explicit fields (`runId`, `projectId`, `model`, tokens, latency, timestamp, metadata).
- **Cost estimation** via `@repo/governance` `calculateCost` and a swappable `PricingConfig` (no hardcoded vendor pricing baked into the engine).
- **Rollups** across **project**, **model**, **run**, and **UTC day** for the kinds of slices FinOps and platform teams inspect first.
- **Rule-based anomalies** for sudden daily spend shifts, tail latency vs cohort median, and completion-token bursts per model (tunable heuristics — not ML).
- **Budget policy hints** (`warn`, `recommend_throttle`, `recommend_block`) that operators can map to gateways, feature flags, or human approval queues.
- **Reporting** in both **Markdown** (human) and **JSON** (automation) with clear language that outputs are **estimates from observed usage**, not invoices or guaranteed savings.

## Why this is the first flagship

The repository is intentionally **catalog-first** (263 blueprint rows). This implementation is the first **end-to-end, clone-and-run slice** that:

1. Exercises a shared workspace package (`@repo/governance`) the way a real service would.
2. Keeps scope bounded: **in-memory** storage, **synthetic** traffic, **no** external LLM keys required.
3. Still threads production concerns called out in the blueprint: **attribution dimensions**, **anomaly surfacing**, **policy-shaped recommendations**, and **audit events** at ingest time.

It exists to answer: *“What does a minimal cost plane look like in TypeScript before we add warehouses and multi-tenant billing?”*

## How to run locally

Prerequisites: **Node.js 20+**, **pnpm** (workspace root).

```bash
# from repository root
pnpm install
cd reference-implementations/ai-cost-monitoring-engine
pnpm start        # prints Markdown + JSON report to stdout (audit count on stderr)
pnpm test         # Vitest unit tests
pnpm typecheck    # tsc --noEmit
pnpm benchmark    # optional local timing harness (see benchmarks/README.md)
```

Optional: copy `.env.example` to `.env` for future configuration hooks (the demo does not require env vars today).

## Architecture (short)

| Step | Module | Role |
|------|--------|------|
| 1 | `mock-data.ts` | Deterministic synthetic events + demo pricing |
| 2 | `ingest-usage-event.ts` | Validate rows, compute cost, append to store, emit `InMemoryAuditLogger` events |
| 3 | `cost-aggregator.ts` | Sum spend by project / model / run / UTC day |
| 4 | `anomaly-detector.ts` | Emit findings for spikes, latency tails, token surges |
| 5 | `budget-policy.ts` | Translate spend + latency signals into advisory actions |
| 6 | `report-generator.ts` | Markdown + JSON summaries |

See [`architecture.md`](./architecture.md) for diagrams, governance touchpoints, observability seams, and failure modes.

## Governance integration

- **Cost math** comes from `@repo/governance` (`calculateCost`, `PricingConfig`).
- **Audit trail** uses `InMemoryAuditLogger` from the same package (swap for durable storage in production).

This package **does not** make applications HIPAA / SOX / GDPR compliant. Treat governance helpers as **patterns**, not certifications (see `@repo/governance` README).

## Production extensions

- Stream ingestion from OTLP or provider usage APIs instead of mock fixtures.
- Persist raw + rolled-up tables in **Postgres**, **ClickHouse**, or **BigQuery** depending on cardinality and query patterns.
- Replace heuristic anomalies with baseline-aware stats or models; keep human review for actions with blast radius.
- Wire **OpenTelemetry** for pipeline lag, dedupe rates, and schema violations (see `PRODUCTION_GUIDE.md`).

## Limitations (by design)

- **In-memory only** — data is lost on process exit; concurrency semantics are single-process.
- **No authentication, tenancy, or RBAC** — add at the HTTP / worker boundary.
- **No invoice reconciliation** — token-based estimates will diverge from provider bills; treat as directional unless you integrate billing truth.
- **No guaranteed savings claims** — the system helps you **measure and attribute** spend so teams can decide what to change; outcomes depend on product and model choices outside this repo.
