import type { RunStatus, TraceContext } from "./types.js";

export interface WorkflowContext {
  trace: TraceContext;
  /** Accumulated outputs from prior steps (also keyed by step id). */
  variables: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  execute: (ctx: WorkflowContext) => Promise<unknown>;
}

export interface WorkflowResult {
  status: Extract<RunStatus, "succeeded" | "failed">;
  stepResults: Record<string, unknown>;
  /** Present when status is failed. */
  error?: string;
  failedStepId?: string;
}

/**
 * Runs steps in order. Each step output is stored under `ctx.variables[step.id]`
 * and in `stepResults[step.id]`. Stops on first thrown error.
 */
export async function runWorkflow(
  steps: WorkflowStep[],
  ctx: WorkflowContext,
): Promise<WorkflowResult> {
  const stepResults: Record<string, unknown> = {};

  for (const step of steps) {
    try {
      const out = await step.execute(ctx);
      stepResults[step.id] = out;
      ctx.variables[step.id] = out;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return {
        status: "failed",
        stepResults,
        error: message,
        failedStepId: step.id,
      };
    }
  }

  return { status: "succeeded", stepResults };
}
