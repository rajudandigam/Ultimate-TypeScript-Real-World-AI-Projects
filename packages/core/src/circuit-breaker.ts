export type CircuitBreakerState = "closed" | "open" | "half-open";

export class CircuitBreakerOpenError extends Error {
  override readonly name = "CircuitBreakerOpenError";

  constructor(message = "Circuit breaker is open") {
    super(message);
  }
}

export interface CircuitBreakerOptions {
  /** Consecutive failures in closed state before opening. */
  failureThreshold: number;
  /** Time before trying half-open after open. */
  resetTimeoutMs: number;
  /** Successes required in half-open to close again. Default 1. */
  halfOpenSuccesses?: number;
}

/**
 * Minimal circuit breaker: closed → open after failures, half-open probe after timeout.
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = "closed";
  private failures = 0;
  private halfOpenSuccessCount = 0;
  private openedAtMs: number | null = null;

  constructor(private readonly opts: CircuitBreakerOptions) {}

  getState(): CircuitBreakerState {
    return this.state;
  }

  /** Run `fn` when the breaker allows; throws `CircuitBreakerOpenError` when open. */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.tryTransitionToHalfOpen();

    if (this.state === "open") {
      throw new CircuitBreakerOpenError();
    }

    try {
      const value = await fn();
      this.recordSuccess();
      return value;
    } catch (e) {
      this.recordFailure();
      throw e;
    }
  }

  private tryTransitionToHalfOpen(): void {
    if (this.state !== "open" || this.openedAtMs === null) return;
    if (Date.now() - this.openedAtMs >= this.opts.resetTimeoutMs) {
      this.state = "half-open";
      this.halfOpenSuccessCount = 0;
    }
  }

  private recordSuccess(): void {
    if (this.state === "half-open") {
      const need = this.opts.halfOpenSuccesses ?? 1;
      this.halfOpenSuccessCount++;
      if (this.halfOpenSuccessCount >= need) {
        this.state = "closed";
        this.failures = 0;
        this.openedAtMs = null;
        this.halfOpenSuccessCount = 0;
      }
    } else {
      this.failures = 0;
    }
  }

  private recordFailure(): void {
    if (this.state === "half-open") {
      this.state = "open";
      this.openedAtMs = Date.now();
      this.halfOpenSuccessCount = 0;
      return;
    }

    this.failures++;
    if (this.failures >= this.opts.failureThreshold) {
      this.state = "open";
      this.openedAtMs = Date.now();
    }
  }
}
