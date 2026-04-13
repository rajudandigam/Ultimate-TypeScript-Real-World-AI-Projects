# Ultimate TypeScript Real-World AI Projects

### Real-world agent systems, workflows, and multi-agent architectures

> Most AI repos teach you how to call an API. This one teaches you how to **build real AI systems** — production-oriented designs in **TypeScript**, not another pile of toy chatbots.

---

## Why this repo exists

After building and reviewing many AI products, one pattern keeps showing up: teams stall at **“prompt + API call”** level. Production systems need **orchestration**, **decision-making**, **memory**, **failure handling**, and explicit **cost vs latency** tradeoffs. This collection bridges that gap with **system designs you can actually implement**.

---

## What is inside

| Category | Count |
|---------|------:|
| Total projects | 253 |
| Workflow / workflow-first | 77 |
| Agent | 144 |
| Multi-agent | 32 |
| Level 5 (production-grade target) | 43 |

Numbers are maintained in [`PROJECT_INDEX.md`](PROJECT_INDEX.md). Each catalog entry is a **blueprint**: problem, architecture, TypeScript-oriented stack, evaluation, failure modes, and scaling — not a vague idea list.

---

## How to explore (important)

This repo is **index-driven**.

1. **Start with the registry** — [`PROJECT_INDEX.md`](PROJECT_INDEX.md) lists every project once, with **system type**, **complexity (L1–L5)**, capabilities, and path.
2. **Browse by domain** — under `projects/`, folders group real industries and stacks (for example `devtools/`, `healthcare/`, `fintech/`, `enterprise-ai/`, `security/`, `travel/`, and many more). Open a folder, then a project slug; each contains **`README.md`** and **`architecture.md`**.
3. **Slice by system type or level** — use the tables in `PROJECT_INDEX.md` (columns **System Type** and **Complexity**). There are no separate `by-system-type/` or `by-complexity/` trees; the index is the filter.

Repository principles and authoring rules for new entries live in [`.cursor/guide.md`](.cursor/guide.md).

---

## What you will learn

- **System design for AI** — when a durable workflow is enough, when an agent fits, when multiple agents collaborate, and how to structure decision loops safely.
- **Production thinking** — cost, latency, observability, guardrails, human-in-the-loop, and regression-style evaluation.
- **Real tradeoffs** — accuracy vs cost, autonomy vs control, reasoning depth vs time-to-answer.

---

## Example projects (high signal)

| Area | Examples |
|------|-----------|
| DevTools & engineering | PR Risk Analyzer, AI Code Review Agent, Schema Migration Safety Agent, AI Debugging Assistant |
| Infra & platforms | Multi-agent incident response, AI cost monitoring, MCP-style tool registries, grid load balancing |
| Enterprise & knowledge | Organizational memory graph, production RAG patterns, contract redlining |
| Personal & lifestyle | Grocery optimization, kids learning planner, life timeline intelligence |
| Advanced domains | Climate risk simulation, satellite change detection, predictive maintenance, digital twin reasoning |

Concrete paths for all of these are in [`PROJECT_INDEX.md`](PROJECT_INDEX.md).

---

## Suggested path if you are new

| Step | Focus | Example direction (see index for paths) |
|------|--------|----------------------------------------|
| 1 | Workflows — deterministic pipelines | Email → task style automation |
| 2 | Agents — reasoning + tools | Code review or debugging agents |
| 3 | Multi-agent — collaboration | Incident response or booking optimizers |
| 4 | Production-grade targets | Cost monitoring, evaluation frameworks, L5 briefs |

---

## System types (short)

| Type | Role |
|------|------|
| **Workflow** | Deterministic or durable pipelines — predictable, often cheaper, easier to test. |
| **Agent** | Reasoning, tools, and decisions under constraints — flexible, needs guardrails. |
| **Multi-agent** | Several roles collaborating — powerful, highest integration and ops cost. |

---

## Complexity levels

| Level | Meaning |
|------|--------|
| L1 | Basic LLM workflows |
| L2 | Structured workflows with clearer control flow |
| L3 | Agent-based systems with reasoning and tools |
| L4 | Multi-step orchestration, memory, or multi-agent coordination |
| L5 | Production-grade targets: observability, scaling, cost control, safety |

---

## Repository layout

```text
PROJECT_INDEX.md          # Single registry: paths, types, complexity
.cursor/guide.md          # How to extend the catalog consistently
templates/                # Scaffolding hints for new entries
projects/
  <domain>/               # e.g. devtools, travel, enterprise-ai
    <project-slug>/
      README.md           # Full brief
      architecture.md     # Diagrams and engineering detail
```

---

## Tech stack (TypeScript-first)

Typical stacks referenced across briefs include **Node.js**, **Next.js**, **OpenAI / Anthropic**, **LangChain.js**, **Vercel AI SDK**, **Zod**, vector stores (e.g. **Pinecone**, **Supabase**), and observability (**LangSmith**, **Helicone**, and similar). Each project’s `README.md` narrows this to what fits that system.

---

## Contributing

This project values **real systems**, **clear architecture**, and **production thinking** — not generic assistant ideas. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full process; in short, follow [`.cursor/guide.md`](.cursor/guide.md), check [`PROJECT_INDEX.md`](PROJECT_INDEX.md) for duplicates, and ship `README.md` + `architecture.md` plus an index row.

---

## Who this is for

Senior and staff engineers, AI engineers, and anyone who wants to move from “I shipped a chatbot” to **“I designed a production AI system.”**

---

## Vision

To be a **practical, TypeScript-first reference** for real-world AI **system design** — workflows, agents, and multi-agent systems — with honesty about tradeoffs and failure modes.

If this repo helps you, a star on GitHub helps others find it.
