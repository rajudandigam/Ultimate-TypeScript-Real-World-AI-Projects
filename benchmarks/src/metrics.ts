/**
 * Small statistical helpers for timing samples (no external deps).
 */

/** Arithmetic mean; returns 0 for an empty array. */
export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

/**
 * Population standard deviation (divide by n).
 * Returns 0 for empty or single-element arrays.
 */
export function standardDeviation(values: readonly number[]): number {
  if (values.length <= 1) return 0;
  const mean = average(values);
  let acc = 0;
  for (const v of values) {
    const d = v - mean;
    acc += d * d;
  }
  return Math.sqrt(acc / values.length);
}

/**
 * Linear-interpolated percentile for p in [0, 100].
 * Sorts a copy of `values` (does not mutate the input).
 */
export function percentile(values: readonly number[], p: number): number {
  if (values.length === 0) return 0;
  const clamped = Math.min(100, Math.max(0, p));
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0]!;
  const rank = (clamped / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
}
