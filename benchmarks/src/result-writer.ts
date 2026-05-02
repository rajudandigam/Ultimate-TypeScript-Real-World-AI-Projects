import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { BenchmarkResult } from "./benchmark-runner.js";

export interface HarnessScenarioDocument {
  name: string;
  meta?: Record<string, unknown>;
  result: BenchmarkResult;
}

export interface HarnessRunDocument {
  suite: string;
  generatedAtIso: string;
  disclaimer: string;
  environment: Record<string, unknown>;
  scenarios: HarnessScenarioDocument[];
}

function ensureDir(filePath: string): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

export function writeJsonResults(filePath: string, doc: HarnessRunDocument): void {
  ensureDir(filePath);
  writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
}

export function writeMarkdownSummary(filePath: string, doc: HarnessRunDocument): void {
  ensureDir(filePath);
  const lines: string[] = [];
  lines.push(`# Benchmark summary — ${doc.suite}`);
  lines.push("");
  lines.push(`_Generated: ${doc.generatedAtIso}_`);
  lines.push("");
  lines.push("## Disclaimer");
  lines.push("");
  lines.push(doc.disclaimer);
  lines.push("");
  lines.push("## Environment (best-effort)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(doc.environment, null, 2));
  lines.push("```");
  lines.push("");

  for (const s of doc.scenarios) {
    lines.push(`## ${s.name}`);
    lines.push("");
    if (s.meta && Object.keys(s.meta).length > 0) {
      lines.push("### Context");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(s.meta, null, 2));
      lines.push("```");
      lines.push("");
    }
    const st = s.result.stats;
    lines.push("| Metric | Value |");
    lines.push("|--------|------:|");
    lines.push(`| Iterations | ${st.iterations} |`);
    lines.push(`| Successes | ${st.successCount} |`);
    lines.push(`| Failures | ${st.failureCount} |`);
    lines.push(`| Sample size (stats) | ${st.sampleCount} |`);
    lines.push(`| min (ms) | ${st.minMs.toFixed(4)} |`);
    lines.push(`| max (ms) | ${st.maxMs.toFixed(4)} |`);
    lines.push(`| avg (ms) | ${st.avgMs.toFixed(4)} |`);
    lines.push(`| p50 (ms) | ${st.p50Ms.toFixed(4)} |`);
    lines.push(`| p95 (ms) | ${st.p95Ms.toFixed(4)} |`);
    lines.push(`| stddev (ms) | ${st.stdDevMs.toFixed(4)} |`);
    lines.push("");

    const failed = s.result.runs.filter((r) => !r.success);
    if (failed.length > 0) {
      lines.push("### Failed iterations");
      lines.push("");
      for (const f of failed) {
        lines.push(`- iteration ${f.iteration}: ${f.error ?? "unknown error"}`);
      }
      lines.push("");
    }
  }

  lines.push("## Full JSON");
  lines.push("");
  lines.push("_See the paired `.json` file for complete per-iteration timings._");
  lines.push("");

  writeFileSync(filePath, lines.join("\n"), "utf8");
}
