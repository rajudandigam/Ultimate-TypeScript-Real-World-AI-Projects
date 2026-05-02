# Benchmark harness (`@repo/benchmarks`)

Reusable **local** benchmark utilities and **suite entrypoints** for flagship code under `reference-implementations/`. This is intentionally small: a runner, basic statistics, and writers for JSON + Markdown.

## Principles

- **Local reference only** — see [`methodology.md`](./methodology.md) for how to interpret (and how **not** to misuse) timings.
- **No fabricated numbers** — suites record what your machine measured; nothing here implies vendor superiority or guaranteed savings.
- **Environment-sensitive** — always ship metadata alongside results (the writers do this by default).

## Layout

| Path | Role |
|------|------|
| `src/benchmark-runner.ts` | Repeat a function `N` times; record duration, success/failure; compute min / max / avg / p50 / p95 |
| `src/metrics.ts` | `average`, `standardDeviation`, `percentile` |
| `src/result-writer.ts` | Persist JSON + Markdown summaries |
| `suites/<name>/run.ts` | Suite-specific orchestration |
| `results/` | Generated artifacts (gitignored except docs) |

## Suites

| Suite | Command | Description |
|-------|---------|-------------|
| Cost monitoring | `pnpm suite:cost-monitoring` | [`suites/cost-monitoring/README.md`](./suites/cost-monitoring/README.md) |

## Typecheck

```bash
cd benchmarks
pnpm typecheck
```

## See also

- Repository plan: [`docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md`](../docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md)
- Broader benchmarking narrative: [`docs/benchmarking/README.md`](../docs/benchmarking/README.md)
