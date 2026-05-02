/**
 * @repo/core — shared runtime primitives (minimal stubs).
 * Expand with typed envelopes, run state, retry policies, and tool boundaries.
 */

export type CorrelationId = string;

type GlobalWithOptionalCrypto = typeof globalThis & {
  crypto?: { randomUUID?: () => string };
};

/** Create a correlation id for tracing a single request / run across services. */
export function createCorrelationId(): CorrelationId {
  const g = globalThis as GlobalWithOptionalCrypto;
  const uuid = g.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return `corr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
