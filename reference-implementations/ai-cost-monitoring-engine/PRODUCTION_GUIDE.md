# Production guide — evolving this reference into a service

This guide explains how to grow the **local, in-memory** demo into a **deployed cost plane** component. It is **not** a compliance checklist and does not claim HIPAA / SOX / GDPR readiness.

---

## 1. Replace in-memory storage with Postgres

**Today:** `UsageEventStore` holds `EnrichedUsageEvent[]` in process memory.

**Production shape:**

1. **Raw table** — append-only usage lines (high write volume).

   Suggested columns (illustrative): `id`, `run_id`, `project_id`, `model`, `input_tokens`, `output_tokens`, `latency_ms`, `occurred_at`, `ingested_at`, `metadata jsonb`, `cost_total numeric`, `cost_currency text`.

2. **Rollup tables** — materialized hourly/daily aggregates keyed by dimensions you query most (`project_id`, `model`, `day`).

3. **Idempotency** — unique constraint on `(provider, external_request_id)` or similar to tolerate retries.

4. **Migrations** — use your migration tool of choice (`node-pg-migrate`, Drizzle, Prisma, etc.).

**Code touchpoints in this repo:**

- Replace `UsageEventStore` internals with `INSERT ...` and return the computed row.
- Keep `calculateCost` at ingest **or** recompute from stored token counts if pricing is versioned — if pricing changes historically, store `pricing_version` with each row.

---

## 2. Connect to real LLM gateways

Gateways (LiteLLM-style proxies, cloud inference endpoints, or your own router) should emit **structured usage** with stable IDs:

- **Attribution:** `projectId`, `environment`, `route`, `release`, `user_segment` (only what policy allows you to retain).
- **Measurement:** token counts from the provider response; latency measured at the gateway.
- **Trace linking:** propagate `runId` / trace ids from upstream services.

**Integration options:**

- **Pull:** scheduled jobs call provider usage APIs and normalize into the same `UsageEvent` shape.
- **Push:** gateway posts to your ingest HTTP endpoint (validate with Zod or similar at the edge).

**Important:** pricing in this demo is a `PricingConfig` object — in production, load it from **config management** or a **database table** updated by FinOps, not from source code.

---

## 3. Add OpenTelemetry

**Tracing**

- Wrap ingest, aggregation, anomaly detection, and report generation in spans.
- Propagate context from your HTTP framework (`@opentelemetry/api`) so a single user request ties to downstream rollups.

**Metrics**

- Counters for accepted/rejected events.
- Histograms for ingest latency, aggregation duration, and report build time.

**Logs**

- Correlate structured logs with `trace_id` / `span_id`.
- If prompts might appear in logs, run `@repo/governance` `redactPII` before emit.

**Minimal dependency path**

1. Add `@opentelemetry/sdk-node` (or your distro) and an OTLP exporter.
2. Configure `OTEL_EXPORTER_OTLP_ENDPOINT` in deployment environments.
3. Start the SDK before accepting traffic (`instrumentation.ts` loaded first).

This reference intentionally avoids a hard OTel dependency so tests stay lightweight — add it at the application shell.

---

## 4. Deploy as a service

**Suggested decomposition**

| Component | Responsibility |
|-----------|------------------|
| Ingest API | Authenticated POST of usage events → validate → persist |
| Worker | Async rollups + anomaly scans + notification dispatch |
| Read API | Query aggregates / serve saved reports |
| UI (optional) | Budget admin + drill-down charts |

**Deployment targets that match common Node patterns**

- **Fly.io / Railway / Render / Docker on Kubernetes** for always-on workers and webhooks.
- **Managed Postgres** (RDS, Cloud SQL, Neon, etc.) for system of record.
- **Redis** (optional) for dedupe keys, rate limits, and short-lived caches of hot aggregates.

**Operational checklist (high level)**

- Backups + PITR for Postgres tables storing usage.
- Secrets management for DB URLs and OTLP keys.
- Per-tenant rate limits on ingest endpoints.
- On-call runbooks for “spend spike” pages (what to roll back first).

---

## 5. Measuring value without fake ROI

This system helps teams **observe and attribute** LLM-related spend and latency so they can:

- Compare **releases** and **routes** on comparable metrics.
- Catch **regressions** that inflate tokens or tail latency.
- Decide when to **throttle** or **block** risky paths based on policy.

Any “savings” depend on what you change in product behavior after reviewing those measurements — do not treat demo numbers as financial promises.
