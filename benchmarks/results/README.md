# Generated benchmark results

When you run a suite (for example `pnpm suite:cost-monitoring` from `benchmarks/`), the harness writes **timestamped** artifacts here:

- `cost-monitoring-<ISO-ish-stamp>.json` — full document including per-iteration timings and environment metadata.
- `cost-monitoring-<ISO-ish-stamp>.md` — human-readable summary tables.

## Git hygiene

Generated files are **ignored by git** (see `.gitignore` in this folder) so accidental commits of laptop-specific timings do not clutter PRs. If you need to share a run for debugging, paste the summary into an issue or attach the JSON out-of-band.

## Not for “official” scoreboards

These outputs are **development aids**. They must not be presented as audited benchmarks, competitive rankings, or proof of ROI unless you have followed `../methodology.md` and run controlled, reproducible trials.
