import path from "node:path";
import { fileURLToPath } from "node:url";
import { aggregateCosts } from "./cost-aggregator.js";
import { detectAnomalies } from "./anomaly-detector.js";
import { evaluateBudgets, type BudgetPolicy } from "./budget-policy.js";
import { UsageEventStore } from "./ingest-usage-event.js";
import { demoPricing, mockUsageEvents } from "./mock-data.js";
import { generateJsonReport, generateMarkdownReport } from "./report-generator.js";

const defaultPolicies: BudgetPolicy[] = [
  {
    projectId: "proj-demo",
    softLimitUsd: 8,
    hardLimitUsd: 40,
    latencyWarnMs: 7500,
  },
  {
    projectId: "proj-internal-tools",
    softLimitUsd: 2,
    hardLimitUsd: 10,
    latencyWarnMs: 9000,
  },
];

export function runDemoReport(): {
  markdown: string;
  json: string;
  auditEventCount: number;
} {
  const pricing = demoPricing();
  const store = new UsageEventStore();
  for (const raw of mockUsageEvents()) {
    store.ingest(pricing, raw);
  }

  const events = store.all();
  const rollups = aggregateCosts(events);
  const anomalies = detectAnomalies(events, rollups);
  const budgets = evaluateBudgets(rollups, defaultPolicies, anomalies, events);

  const input = {
    generatedAtMs: Date.now(),
    eventCount: events.length,
    rollups,
    anomalies,
    budgets,
  };

  return {
    markdown: generateMarkdownReport(input),
    json: generateJsonReport(input),
    auditEventCount: store.audit.events.length,
  };
}

async function main(): Promise<void> {
  const { markdown, json, auditEventCount } = runDemoReport();
  process.stdout.write(markdown);
  process.stdout.write("\n\n--- json ---\n");
  process.stdout.write(json);
  process.stdout.write("\n");
  process.stderr.write(
    `[ai-cost-monitoring-engine] audit events recorded: ${auditEventCount}\n`,
  );
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const selfPath = path.resolve(fileURLToPath(import.meta.url));
const isMain = entryPath !== "" && entryPath === selfPath;

if (isMain) {
  main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
