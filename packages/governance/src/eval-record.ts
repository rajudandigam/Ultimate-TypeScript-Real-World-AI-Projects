/**
 * Lightweight shapes for recording offline/online eval runs alongside governance data.
 */

export interface EvalMetric {
  name: string;
  value: number;
  unit?: string;
}

export interface EvalResult {
  caseId: string;
  passed: boolean;
  metrics: EvalMetric[];
  notes?: string;
}

export interface EvalRun {
  runId: string;
  suiteId: string;
  startedAtMs: number;
  finishedAtMs?: number;
  results: EvalResult[];
}
