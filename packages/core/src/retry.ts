export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  /** When false, no jitter. Default true. */
  jitter?: boolean;
  /** If false, do not retry for this error. Default: always retry. */
  isRetryable?: (error: unknown) => boolean;
}

export type RetryOutcome<T, E = unknown> =
  | { ok: true; value: T; attempts: number }
  | { ok: false; error: E; attempts: number };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries `fn` with exponential backoff. On final failure returns `{ ok: false, error, attempts }`
 * instead of throwing (unless `mapError` throws).
 */
export async function retryWithBackoff<T, E = unknown>(
  fn: (attemptIndex: number) => Promise<T>,
  options: RetryOptions,
  mapError?: (error: unknown) => E,
): Promise<RetryOutcome<T, E>> {
  const maxAttempts = Math.max(1, options.maxAttempts);
  const initialDelayMs = Math.max(0, options.initialDelayMs);
  const maxDelayMs = options.maxDelayMs ?? 60_000;
  const backoffFactor = options.backoffFactor ?? 2;
  const jitter = options.jitter ?? true;
  const isRetryable = options.isRetryable ?? (() => true);
  const toError = mapError ?? ((e: unknown) => e as E);

  let delayMs = initialDelayMs;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const value = await fn(attempt);
      return { ok: true, value, attempts: attempt + 1 };
    } catch (err) {
      lastError = err;
      const lastAttempt = attempt === maxAttempts - 1;
      if (!isRetryable(err) || lastAttempt) {
        return { ok: false, error: toError(lastError), attempts: attempt + 1 };
      }
      let wait = Math.min(delayMs, maxDelayMs);
      if (jitter) wait = wait * (0.5 + Math.random() * 0.5);
      await sleep(wait);
      delayMs = Math.min(delayMs * backoffFactor, maxDelayMs);
    }
  }

  return { ok: false, error: toError(lastError), attempts: maxAttempts };
}
