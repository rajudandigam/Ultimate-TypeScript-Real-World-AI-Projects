/**
 * In-process token bucket limiter for demos and single-node services.
 * Not distributed — use a shared store (e.g. Redis) for multi-instance rate limits.
 */

export interface TokenBucketOptions {
  capacity: number;
  refillPerSecond: number;
}

interface BucketState {
  tokens: number;
  updatedAtMs: number;
}

export class InMemoryTokenBucketLimiter {
  private readonly buckets = new Map<string, BucketState>();

  constructor(private readonly opts: TokenBucketOptions) {}

  /**
   * Attempts to consume `cost` tokens for `key`.
   * Refills continuously based on elapsed time since the last call.
   */
  tryAcquire(key: string, cost = 1): boolean {
    if (cost <= 0) return true;
    const now = Date.now();
    let state = this.buckets.get(key);
    if (!state) {
      state = { tokens: this.opts.capacity, updatedAtMs: now };
    }

    const elapsedSec = (now - state.updatedAtMs) / 1000;
    let tokens = Math.min(
      this.opts.capacity,
      state.tokens + elapsedSec * this.opts.refillPerSecond,
    );

    if (tokens < cost) {
      this.buckets.set(key, { tokens, updatedAtMs: now });
      return false;
    }

    tokens -= cost;
    this.buckets.set(key, { tokens, updatedAtMs: now });
    return true;
  }
}
