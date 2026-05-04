import {
  calculateCost,
  InMemoryAuditLogger,
  type PricingConfig,
} from "@repo/governance";
import {
  UsageEventSchema,
  type EnrichedUsageEvent,
  type UsageEvent,
} from "./types.js";

export class UsageEventStore {
  private readonly items: EnrichedUsageEvent[] = [];
  private seq = 0;

  /** Optional audit trail (same package as cost estimates). */
  readonly audit = new InMemoryAuditLogger();

  all(): readonly EnrichedUsageEvent[] {
    return this.items;
  }

  /** Validates `raw` with Zod before enrich + persist. */
  ingest(pricing: PricingConfig, raw: unknown): EnrichedUsageEvent {
    const parsed = UsageEventSchema.safeParse(raw);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      throw new Error(`Invalid usage event: ${detail}`);
    }
    const event: UsageEvent = parsed.data;

    const costEstimate = calculateCost(
      {
        model: event.model,
        promptTokens: event.inputTokens,
        completionTokens: event.outputTokens,
      },
      pricing,
    );
    this.seq += 1;
    const enriched: EnrichedUsageEvent = {
      ...event,
      eventId: `evt_${String(this.seq).padStart(5, "0")}`,
      costEstimate,
    };
    this.items.push(enriched);
    this.audit.log({
      runId: event.runId,
      actor: "ingest",
      action: "usage.ingested",
      resource: `project:${event.projectId}`,
      metadata: {
        eventId: enriched.eventId,
        model: event.model,
        cost: costEstimate.total,
        latencyMs: event.latencyMs,
      },
    });
    return enriched;
  }
}
