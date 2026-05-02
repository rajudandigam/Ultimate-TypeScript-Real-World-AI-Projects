# Benchmark methodology

This repository’s **`benchmarks/`** workspace is a **local harness** for timing small, deterministic slices of flagship code (for example, pure aggregation over in-memory arrays). It exists so contributors can sanity-check regressions on their own machines — **not** to produce publishable “headline” performance numbers.

## What these numbers are

- **Reference benchmarks** — they describe one run on one environment at one point in time.
- **Not universal claims** — wall time varies with CPU model, thermals, background processes, Node.js version, and pnpm install layout.
- **Not comparative marketing** — unless a suite explicitly documents a controlled A/B against another tool with the same hardware, OS, dataset, and build flags, **do not** claim superiority over vendors or open-source alternatives.

## Environment matters

Always record, alongside results:

- Node.js version and platform
- Approximate CPU / core count and RAM (best-effort is fine)
- The dataset size (e.g. number of synthetic events) and iteration count

The harness writes this metadata into each JSON artifact. If you move machines, **expect different numbers** even when the code is identical.

## Reproducibility before publishing

If you ever cite benchmark results externally (blog posts, talks, vendor comparisons):

1. **Freeze** the git commit, dependency lockfile, and dataset generator seed or scale.
2. **Document** hardware, OS, power mode (laptop on battery vs plugged in changes results).
3. **Repeat** runs across multiple trials and report dispersion (min / max / p95), not a single best sample.
4. **Prefer** relative comparisons on the **same** machine (before vs after a change) over absolute “our app is faster than X” claims.

**Do not publish fabricated benchmark numbers.** If a run failed or the sample size is tiny, say so plainly.

## Relationship to product SLAs

Nothing under `benchmarks/` establishes a service-level objective (SLO) or production latency guarantee. For customer-facing SLAs, use continuous profiling in real environments, not local micro-benchmarks alone.
