import { performance } from "node:perf_hooks";
import { average, percentile, standardDeviation } from "./metrics.js";

export interface BenchmarkRun {
  iteration: number;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface BenchmarkStats {
  iterations: number;
  successCount: number;
  failureCount: number;
  /** Statistics use successful iterations only; empty if all failed. */
  sampleCount: number;
  minMs: number;
  maxMs: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  stdDevMs: number;
}

export interface BenchmarkResult {
  name: string;
  runs: BenchmarkRun[];
  stats: BenchmarkStats;
}

function summarizeSuccessfulDurations(runs: readonly BenchmarkRun[]): BenchmarkStats {
  const durations = runs.filter((r) => r.success).map((r) => r.durationMs);
  const iterations = runs.length;
  const successCount = durations.length;
  const failureCount = iterations - successCount;

  if (durations.length === 0) {
    return {
      iterations,
      successCount,
      failureCount,
      sampleCount: 0,
      minMs: 0,
      maxMs: 0,
      avgMs: 0,
      p50Ms: 0,
      p95Ms: 0,
      stdDevMs: 0,
    };
  }

  return {
    iterations,
    successCount,
    failureCount,
    sampleCount: durations.length,
    minMs: Math.min(...durations),
    maxMs: Math.max(...durations),
    avgMs: average(durations),
    p50Ms: percentile(durations, 50),
    p95Ms: percentile(durations, 95),
    stdDevMs: standardDeviation(durations),
  };
}

/**
 * Executes `fn` repeatedly, recording wall-clock duration per iteration.
 * Failures are captured without stopping the suite unless `stopOnError` is true.
 */
export async function runBenchmark(
  name: string,
  fn: () => void | Promise<void>,
  options: {
    iterations: number;
    /** When true, abort remaining iterations after the first thrown error. */
    stopOnError?: boolean;
  },
): Promise<BenchmarkResult> {
  const iterations = Math.max(1, Math.floor(options.iterations));
  const runs: BenchmarkRun[] = [];

  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    try {
      await fn();
      const t1 = performance.now();
      runs.push({
        iteration: i,
        durationMs: t1 - t0,
        success: true,
      });
    } catch (err) {
      const t1 = performance.now();
      const message = err instanceof Error ? err.message : String(err);
      runs.push({
        iteration: i,
        durationMs: t1 - t0,
        success: false,
        error: message,
      });
      if (options.stopOnError) break;
    }
  }

  return { name, runs, stats: summarizeSuccessfulDurations(runs) };
}
