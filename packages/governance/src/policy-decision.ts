/**
 * Typed policy outcomes for routing, billing gates, and human-in-the-loop.
 * This module records decisions — it does not evaluate policy rules for you.
 */

export type DecisionReason =
  | "allowed_by_default"
  | "denied_by_policy"
  | "budget_exceeded"
  | "rate_limited"
  | "requires_human_review"
  | (string & {});

export interface PolicyDecision {
  runId: string;
  decision: "allow" | "deny" | "require_review";
  reason: DecisionReason;
  detail?: string;
  metadata?: Record<string, unknown>;
  decidedAtMs: number;
}

export interface PolicyDecisionLog {
  entries: PolicyDecision[];
}

/** Appends an immutable decision record with a server-generated timestamp. */
export function recordPolicyDecision(
  log: PolicyDecisionLog,
  partial: Omit<PolicyDecision, "decidedAtMs">,
): PolicyDecision {
  const entry: PolicyDecision = { ...partial, decidedAtMs: Date.now() };
  log.entries.push(entry);
  return entry;
}
