/**
 * Lightweight tracing hooks. Swap for OpenTelemetry later without changing call sites much.
 * Default implementation is no-op safe for unit tests and local scripts.
 */

export interface OtelSpan {
  readonly name: string;
  end(): void;
}

export interface OtelTracer {
  startSpan(name: string, attributes?: Record<string, unknown>): OtelSpan;
  endSpan(span: OtelSpan): void;
  recordException(span: OtelSpan, error: unknown): void;
}

class NoopSpan implements OtelSpan {
  constructor(readonly name: string) {}
  end(): void {}
}

/** No network, no SDK: spans are in-memory markers only. */
export function createNoopOtelTracer(): OtelTracer {
  return {
    startSpan(name: string, _attributes?: Record<string, unknown>) {
      return new NoopSpan(name);
    },
    endSpan(span: OtelSpan) {
      span.end();
    },
    recordException(_span: OtelSpan, _error: unknown) {
      /* hook point for real OTel */
    },
  };
}
