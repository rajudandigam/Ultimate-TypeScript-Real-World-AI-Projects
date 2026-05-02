import type { RunStatus } from "./types.js";

/**
 * Serializable run snapshot suitable for swapping `InMemoryRunStateStore`
 * for Postgres (same fields, remote persistence).
 */
export interface DurableRunState {
  runId: string;
  status: RunStatus;
  payload: unknown;
  /** Optimistic concurrency / revision counter. */
  version: number;
  updatedAtMs: number;
}

/**
 * In-process store for demos and tests. Not durable across restarts.
 */
export class InMemoryRunStateStore {
  private readonly byId = new Map<string, DurableRunState>();

  get(runId: string): DurableRunState | undefined {
    return this.byId.get(runId);
  }

  /** Insert or replace (use `compareAndSet` when you need CAS semantics). */
  put(state: DurableRunState): void {
    this.byId.set(state.runId, { ...state });
  }

  /**
   * Updates if `expectedVersion` matches the stored version.
   * @returns the new state, or `undefined` on missing run or version mismatch.
   */
  compareAndSet(
    runId: string,
    expectedVersion: number,
    patch: Partial<Pick<DurableRunState, "status" | "payload">>,
  ): DurableRunState | undefined {
    const cur = this.byId.get(runId);
    if (!cur || cur.version !== expectedVersion) return undefined;
    const next: DurableRunState = {
      ...cur,
      ...patch,
      version: cur.version + 1,
      updatedAtMs: Date.now(),
    };
    this.byId.set(runId, next);
    return next;
  }

  delete(runId: string): boolean {
    return this.byId.delete(runId);
  }
}
