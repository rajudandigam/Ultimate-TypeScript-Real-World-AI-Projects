#!/usr/bin/env python3
"""Generate 10 Agentic UI (AG-UI) projects under projects/agentic-ui/. Run from repo root."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "scripts" / "agentic_ui_projects.json"


def stack_block(p: dict) -> str:
    apis = "\n".join(f"- {a}" for a in p["api_lines"])
    oss = "\n".join(f"- {x}" for x in p["oss_extra"])
    return f"""
<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **{p['title']}** (Agentic UI, {p['level']}) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
{apis}

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
{oss}

### Stack Choice Guide
- **Best default:** {p['stack_default']}
- **Lightweight:** {p['stack_light']}
- **Production-heavy:** {p['stack_heavy']}

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.
"""


def arch_doc(p: dict) -> str:
    a = p["arch"]
    diagram = a["diagram"].replace("\\n", "\n")
    core = "\n".join(f"- {c}" for c in a["core"])
    df = "\n".join(f"{i}. {d}" for i, d in enumerate(a["dataflow"], 1))
    sc = "\n".join(f"- {s}" for s in a["scale"])
    fl = "\n".join(f"- {f}" for f in a["fail"])
    ob = "\n".join(f"- {o}" for o in a["obs"])
    sy = "\n".join(f"- {s}" for s in a["sync"])
    return f"""### 1. System Overview

{p["arch_overview"]}

---

### 2. Architecture Diagram (text-based)

```
{diagram}
```

---

### 3. Core Components

{core}

---

### 4. Data Flow

{df}

---

### 5. Agent Interaction (AG-UI)

{a["agent_ix"]}

---

### 6. Scaling Considerations

{sc}

---

### 7. Failure Handling

{fl}

---

### 8. Observability

{ob}

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **{p["title"]}**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
{sy}

### Suggested Data and Infra Layer
- Postgres (RLS) for entities, saved lenses, audit of AI-proposed UI mutations.
- Redis for rate limits, presence, ephemeral collaboration.
- Object storage for exports and large attachments.
- Queues/workers for heavy async recompute off the hot UI path.

### Suggested Runtime and Deployment
- Vercel for Next.js when web-first; Fly/Railway/Docker for WebSocket workers and long agent runs.

### Testing and Evaluation Strategy
- Vitest for reducers and schema validation; Playwright for AG-UI golden paths; eval sets for grounded numeric or log claims.

### Security and Permissions Layer
{p["arch_security"]}
"""


def readme(p: dict) -> str:
    why = "\n".join(f"- {w}" for w in p["why"])
    ag = "\n".join(ag for ag in p["ag_model"])
    st = "\n".join(f"- {s}" for s in p["stack_examples"])
    ap = "\n".join(f"- {x}" for x in p["arch_points"])
    impl = ""
    for title, items in p["impl"]:
        impl += f"\n### {title}\n" + "\n".join(f"- {i}" for i in items) + "\n"
    ev = "\n".join(f"- {e}" for e in p["eval"])
    fa = "\n".join(f"- {f}" for f in p["fail"])
    pr = "\n".join(f"- {x}" for x in p["prod"])
    le = "\n".join(f"- {l}" for l in p["learn"])
    lvl = p["level"]
    return f"""System Type: Agentic UI
Complexity: {lvl}
Industry: {p["industry"]}
Capabilities: {p["caps"]}

# {p["title"]}

## 🧠 Overview
{p["overview"]}

---

## 🎯 Problem
{p["problem"]}

---

## 💡 Why This Matters
{why}

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** {lvl}

---

## 🏭 Industry
{p["industry"]}

---

## 🧩 Capabilities
{p["caps"]}

---

## AG-UI Interaction Model
{ag}

---

## 🛠️ Suggested TypeScript Stack
Examples:

{st}

---
{stack_block(p)}

## 🧱 High-Level Architecture
{ap}

---

## 🔄 Implementation Steps
{impl}
---

## 📊 Evaluation
{ev}

---

## ⚠️ Challenges & Failure Cases
{fa}

---

## 🏭 Production Considerations
{pr}

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
{le}
"""


def main() -> None:
    projects: list[dict] = json.loads(DATA.read_text(encoding="utf-8"))
    base = ROOT / "projects" / "agentic-ui"
    for p in projects:
        d = base / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "README.md").write_text(readme(p).strip() + "\n", encoding="utf-8")
        (d / "architecture.md").write_text(arch_doc(p).strip() + "\n", encoding="utf-8")
    print("Wrote", len(projects), "projects under", base)


if __name__ == "__main__":
    main()
