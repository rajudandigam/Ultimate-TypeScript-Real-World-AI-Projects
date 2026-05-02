import {
  calculateCost,
  InMemoryAuditLogger,
  type PricingConfig,
} from "@repo/governance";
import type { EnrichedUsageEvent, UsageEvent } from "./types.js";

export class UsageEventStore {
  private readonly items: EnrichedUsageEvent[] = [];
  private seq = 0;

  /** Optional audit trail (same package as cost estimates). */
  readonly audit = new InMemoryAuditLogger();

  all(): readonly EnrichedUsageEvent[] {
    return this.items;
  }

  ingest(pricing: PricingConfig, raw: UsageEvent): EnrichedUsageEvent {
    validateUsageEvent(raw);
    const costEstimate = calculateCost(
      {
        model: raw.model,
        promptTokens: raw.inputTokens,
        completionTokens: raw.outputTokens,
      },
      pricing,
    );
    this.seq += 1;
    const enriched: EnrichedUsageEvent = {
      ...raw,
      eventId: `evt_${String(this.seq).padStart(5, "0")}`,
      costEstimate,
    };
    this.items.push(enriched);
    this.audit.log({
      runId: raw.runId,
      actor: "ingest",
      action: "usage.ingested",
      resource: `project:${raw.projectId}`,
      metadata: {
        eventId: enriched.eventId,
        model: raw.model,
        cost: costEstimate.total,
        latencyMs: raw.latencyMs,
      },
    });
    return enriched;
  }
}

export function validateUsageEvent(e: UsageEvent): void {
  if (!e.runId) throw new Error("runId is required");
  if (!e.projectId) throw new Error("projectId is required");
  if (!e.model) throw new Error("model is required");
  if (e.inputTokens < 0 || e.outputTokens < 0)
    throw new Error("token counts must be non-negative");
  if (!Number.isFinite(e.latencyMs) || e.latencyMs < 0)
    throw new Error("latencyMs must be a non-negative finite number");
  if (!Number.isFinite(e.timestamp)) throw new Error("timestamp must be finite");
}
