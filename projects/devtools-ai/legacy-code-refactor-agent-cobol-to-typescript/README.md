System Type: Agent  
Complexity: Level 5  
Industry: DevTools / Modernization  
Capabilities: Reasoning, Transformation  

# Legacy Code Refactor Agent (COBOL → TypeScript)

## 🧠 Overview
A **governed modernization agent** that ingests **COBOL (and copybooks)**, builds a **semantic graph** (paragraphs, data divisions, file sections, calls), and emits **TypeScript service modules** with **parity tests** from **golden batch jobs**—**human architect approval** gates every merge; targets **strangler-fig** migration (HTTP/BFF in front of mainframe) not fantasy “one-click rewrite.”

*Catalog note:* Distinct from **`Codebase Migration Automation System`** (general workflow migration); this is **mainframe COBOL → TS** with **L5** rigor: proofs, diffs, and regulatory data sensitivity.

---

## 🎯 Problem
COBOL cores are expensive to maintain; vendor lock-in; juniors cannot safely change batch logic; blind LLM translation creates silent financial bugs.

---

## 💡 Why This Matters
- **Pain it removes:** Multi-year rewrite paralysis and undocumented copybook sprawl.
- **Who benefits:** insurers, banks, and public sector clearing modernization roadmaps.

---

## 🏗️ System Type
**Chosen:** **Single Agent** orchestrating **parser tools**, **symbol graph DB**, and **codegen templates**; **test harness** is non-LLM.

---

## ⚙️ Complexity Level
**Target:** Level 5 — correctness evidence, security, and long-horizon program management.

---

## 🏭 Industry
Enterprise engineering / modernization

---

## 🧩 Capabilities
Reasoning, Transformation, Automation, Observability, Retrieval

---

## 🛠️ Suggested TypeScript Stack
Node.js, GnuCOBOL or vendor parsers (Micro Focus), Tree-sitter custom grammar where applicable, Postgres graph, OpenAI SDK for guided refactor, Jest parity suites, OpenTelemetry, Bazel/monorepo for generated packages

---

## 🧱 High-Level Architecture
Repo ingest → **parse + normalize** → **graph builder** → **slice planner** (strangler boundaries) → **Agent codegen** per slice → **compile & unit tests** → **batch diff** on sample JCL datasets → PR with human reviewer checklist

---

## 🔄 Implementation Steps
1. Read-only inventory + dead code detection  
2. Data division → TypeScript types codegen  
3. File I/O → S3/queue adapters with interface seams  
4. CICS transaction boundaries mapped to HTTP routes (design)  
5. Continuous reconciliation reports vs production logs (shadow)  

---

## 📊 Evaluation
Parity % on golden batches, defect escape rate post-merge, cyclomatic complexity reduction, time-to-first shippable slice

---

## ⚠️ Failure Scenarios
**FLOAT vs packed decimal** mismatches; **implicit fall-through** in PERFORM chains; **missing copybook** versions—typed money wrappers, exhaustive diff logs, refuse codegen until graph resolves, never auto-deploy to prod

---

## 🤖 Agent breakdown
- **Parser toolchain:** deterministic AST + diagnostics.  
- **Graph agent:** proposes module boundaries with coupling metrics from static analysis.  
- **Codegen agent:** emits TS using locked templates + property tests; cites source line spans.  
- **Reviewer copilot:** summarizes risk hotspots for human architects (no auto-merge).

---

## 🎓 What You Learn
Mainframe semantics, safe LLM-assisted codegen, strangler-fig architecture patterns
