import type { CostEstimate } from "@repo/governance";

/** Raw usage line as emitted by an app or LLM gateway (synthetic in this demo). */
export interface UsageEvent {
  runId: string;
  projectId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  /** Epoch milliseconds (UTC). */
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Stored event with deterministic id and governance-derived cost estimate. */
export interface EnrichedUsageEvent extends UsageEvent {
  eventId: string;
  costEstimate: CostEstimate;
}

export interface CostRollups {
  /** Total estimated spend (same currency as CostEstimate, usually USD). */
  byProject: Map<string, number>;
  byModel: Map<string, number>;
  byRun: Map<string, number>;
  /** UTC calendar day key `YYYY-MM-DD`. */
  byDay: Map<string, number>;
}
