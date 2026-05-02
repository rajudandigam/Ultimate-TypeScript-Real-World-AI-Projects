/**
 * Structured audit trail for who did what to which resource (library-level).
 * Wire `AuditLogger` to durable storage in production.
 */

export interface AuditEvent {
  runId: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AuditLogger {
  log(
    event: Omit<AuditEvent, "timestamp"> & { timestamp?: number },
  ): void | Promise<void>;
}

/** Keeps events in memory for tests and local demos only. */
export class InMemoryAuditLogger implements AuditLogger {
  readonly events: AuditEvent[] = [];

  log(
    event: Omit<AuditEvent, "timestamp"> & { timestamp?: number },
  ): void {
    const full: AuditEvent = {
      ...event,
      timestamp: event.timestamp ?? Date.now(),
    };
    this.events.push(full);
  }
}
