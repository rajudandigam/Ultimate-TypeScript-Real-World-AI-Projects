import type { AnomalyFinding } from "./anomaly-detector.js";
import type { BudgetFinding } from "./budget-policy.js";
import { rollupToPlainObject } from "./cost-aggregator.js";
import type { CostRollups } from "./types.js";

export interface ReportInput {
  generatedAtMs: number;
  eventCount: number;
  rollups: CostRollups;
  anomalies: AnomalyFinding[];
  budgets: BudgetFinding[];
}

export function generateJsonReport(input: ReportInput): string {
  return JSON.stringify(
    {
      disclaimer:
        "Figures are estimates from token usage and your pricing table. They describe what this pipeline can measure for a given batch — not guaranteed spend, savings, or invoice reconciliation.",
      generatedAtMs: input.generatedAtMs,
      eventCount: input.eventCount,
      rollups: rollupToPlainObject(input.rollups),
      anomalies: input.anomalies,
      budgets: input.budgets,
    },
    null,
    2,
  );
}

export function generateMarkdownReport(input: ReportInput): string {
  const lines: string[] = [];
  lines.push("# AI Cost Monitoring — demo report");
  lines.push("");
  lines.push(
    "> **Measurement, not a promise:** totals below are derived from synthetic usage and a demo `PricingConfig`. They show what the system can surface for investigation — not contractual savings or billing truth.",
  );
  lines.push("");
  lines.push(`- Generated (UTC): ${new Date(input.generatedAtMs).toISOString()}`);
  lines.push(`- Events analyzed: ${input.eventCount}`);
  lines.push("");

  lines.push("## Rollups");
  lines.push("");
  lines.push("### By project");
  lines.push("");
  for (const [k, v] of [...input.rollups.byProject.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`- **${k}**: ${v.toFixed(6)}`);
  }
  lines.push("");
  lines.push("### By model");
  lines.push("");
  for (const [k, v] of [...input.rollups.byModel.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`- **${k}**: ${v.toFixed(6)}`);
  }
  lines.push("");
  lines.push("### By run");
  lines.push("");
  for (const [k, v] of [...input.rollups.byRun.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`- **${k}**: ${v.toFixed(6)}`);
  }
  lines.push("");
  lines.push("### By UTC day");
  lines.push("");
  for (const [k, v] of [...input.rollups.byDay.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`- **${k}**: ${v.toFixed(6)}`);
  }
  lines.push("");

  lines.push("## Anomalies");
  lines.push("");
  if (input.anomalies.length === 0) {
    lines.push("_No anomalies detected for this batch._");
  } else {
    for (const a of input.anomalies) {
      lines.push(`- **${a.type}** (${a.severity}): ${a.description}`);
    }
  }
  lines.push("");

  lines.push("## Budget recommendations");
  lines.push("");
  for (const b of input.budgets) {
    lines.push(
      `- **${b.projectId}** — \`${b.action}\`: ${b.reason}`,
    );
  }
  lines.push("");

  return lines.join("\n");
}
