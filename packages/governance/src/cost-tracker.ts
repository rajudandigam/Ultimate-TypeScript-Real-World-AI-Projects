/**
 * Cost estimation from token usage using caller-supplied pricing tables.
 * Amounts are in the same currency unit as the pricing config (often USD dollars).
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
}

export interface ModelUsage extends TokenUsage {
  model: string;
}

/** Price per 1M tokens for a single model entry. */
export interface TokenPricing {
  promptPerMillion: number;
  completionPerMillion: number;
}

/** Caller-owned pricing — swap tables per provider, region, or discount contract. */
export interface PricingConfig {
  models: Record<string, TokenPricing>;
  /** Used when `usage.model` is missing from `models`. */
  fallback?: TokenPricing;
}

export interface CostEstimate {
  model: string;
  /** ISO-like tag for display only; amounts follow `PricingConfig` units. */
  currency: string;
  promptCost: number;
  completionCost: number;
  total: number;
}

function resolvePricing(
  model: string,
  pricing: PricingConfig,
): TokenPricing {
  const direct = pricing.models[model];
  if (direct) return direct;
  if (pricing.fallback) return pricing.fallback;
  throw new Error(
    `No pricing for model "${model}" and no fallback configured`,
  );
}

export function calculateCost(
  usage: ModelUsage,
  pricing: PricingConfig,
  currency = "USD",
): CostEstimate {
  const p = resolvePricing(usage.model, pricing);
  const promptCost = (usage.promptTokens / 1_000_000) * p.promptPerMillion;
  const completionCost =
    (usage.completionTokens / 1_000_000) * p.completionPerMillion;
  return {
    model: usage.model,
    currency,
    promptCost,
    completionCost,
    total: promptCost + completionCost,
  };
}

export interface RunCostAggregate {
  total: number;
  /** Per-model subtotals for the run. */
  byModel: Record<string, number>;
  estimates: CostEstimate[];
}

/**
 * Groups usage rows by `runId`, applies `calculateCost` per row, and sums totals.
 */
export function aggregateCostByRun(
  rows: Array<{ runId: string; usage: ModelUsage }>,
  pricing: PricingConfig,
  currency = "USD",
): Map<string, RunCostAggregate> {
  const map = new Map<string, RunCostAggregate>();

  for (const row of rows) {
    const est = calculateCost(row.usage, pricing, currency);
    const cur = map.get(row.runId) ?? {
      total: 0,
      byModel: {},
      estimates: [],
    };
    cur.estimates.push(est);
    cur.total += est.total;
    cur.byModel[est.model] = (cur.byModel[est.model] ?? 0) + est.total;
    map.set(row.runId, cur);
  }

  return map;
}
