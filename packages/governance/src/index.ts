/**
 * @repo/governance — shared governance primitives (minimal stubs).
 */

export type AuditLevel = "info" | "warn" | "error";

export interface AuditEvent {
  level: AuditLevel;
  message: string;
  correlationId?: string;
}

/** Placeholder: emit structured audit events (wire to your log sink). */
export function emitAuditEvent(event: AuditEvent): AuditEvent {
  return event;
}
