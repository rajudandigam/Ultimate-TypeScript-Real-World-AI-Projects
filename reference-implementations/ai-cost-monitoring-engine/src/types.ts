import type { CostEstimate } from "@repo/governance";
import { z } from "zod";

/** Zod schema for inbound usage rows (HTTP/webhook boundaries later; CLI/mock today). */
export const UsageEventSchema = z.object({
  runId: z.string().min(1),
  projectId: z.string().min(1),
  model: z.string().min(1),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  latencyMs: z.number().finite().nonnegative(),
  /** Epoch milliseconds (UTC). */
  timestamp: z.number().finite(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/** Raw usage line as emitted by an app or LLM gateway (synthetic in this demo). */
export type UsageEvent = z.infer<typeof UsageEventSchema>;

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
