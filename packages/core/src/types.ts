/** Catalog-aligned system classification (see repo README). */
export type SystemType = "workflow" | "agent" | "multi-agent" | "agentic-ui";

/** Blueprint complexity tier. */
export type ComplexityLevel = "L1" | "L2" | "L3" | "L4" | "L5";

/** Lifecycle of a durable run / workflow execution. */
export type RunStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

/** Cross-service trace identifiers (OTel-compatible strings optional). */
export interface TraceContext {
  correlationId: string;
  runId?: string;
  traceparent?: string;
  /** Parent span id hint for log correlation (not a full OTel span handle). */
  parentSpanId?: string;
}

/** Discriminated result for explicit error handling without throwing. */
export type Result<T, E = unknown> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type CorrelationId = string;

type GlobalWithOptionalCrypto = typeof globalThis & {
  crypto?: { randomUUID?: () => string };
};

/** Create a correlation id for tracing a single request or run. */
export function createCorrelationId(): CorrelationId {
  const g = globalThis as GlobalWithOptionalCrypto;
  const uuid = g.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return `corr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
