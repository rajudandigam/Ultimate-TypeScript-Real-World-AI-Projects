/**
 * Lightweight input/output guardrails — synchronous or async checks
 * (blocklists, length limits, regex tripwires, etc.).
 */

export type GuardrailResult =
  | { ok: true }
  | { ok: false; reason: string; code?: string };

export type InputGuardrail = (
  input: string,
  ctx?: Record<string, unknown>,
) => GuardrailResult | Promise<GuardrailResult>;

export type OutputGuardrail = (
  output: string,
  ctx?: Record<string, unknown>,
) => GuardrailResult | Promise<GuardrailResult>;

export async function runInputGuardrails(
  input: string,
  guardrails: InputGuardrail[],
  ctx?: Record<string, unknown>,
): Promise<GuardrailResult> {
  for (const g of guardrails) {
    const r = await g(input, ctx);
    if (!r.ok) return r;
  }
  return { ok: true };
}

export async function runOutputGuardrails(
  output: string,
  guardrails: OutputGuardrail[],
  ctx?: Record<string, unknown>,
): Promise<GuardrailResult> {
  for (const g of guardrails) {
    const r = await g(output, ctx);
    if (!r.ok) return r;
  }
  return { ok: true };
}
