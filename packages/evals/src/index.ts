/**
 * @repo/evals — evaluation schemas and harness helpers (minimal stubs).
 */

export interface EvalCase<I, O> {
  id: string;
  input: I;
  expected?: O;
}

/** Placeholder: register a case for batch evaluation. */
export function defineEvalCase<I, O>(c: EvalCase<I, O>): EvalCase<I, O> {
  return c;
}
