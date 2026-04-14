#!/usr/bin/env python3
"""
Idempotently enrich project README.md + architecture.md with implementation-oriented
stack guidance. Safe to re-run: skips files that already contain the enrichment marker.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = ROOT / "projects"
README_CATALOG = ROOT / "README.md"
README_MARKER = "<!-- stack-guidance-enriched:v1 -->"
ARCH_MARKER = "<!-- arch-stack-layers-enriched:v1 -->"


def parse_catalog() -> dict[str, dict[str, str]]:
    """path -> {name, stype, complexity, caps} from root README project tables."""
    text = README_CATALOG.read_text(encoding="utf-8")
    row_re = re.compile(
        r"^\| (?P<name>[^|]+) \| (?P<stype>[^|]+) \| (?P<cx>[^|]+) \| (?P<caps>[^|]+) \| \[`(?P<path>projects/[^`]+)`\]\([^)]+\) \|"
    )
    meta: dict[str, dict[str, str]] = {}
    for line in text.splitlines():
        m = row_re.match(line.strip())
        if not m:
            continue
        path = m.group("path").strip()
        meta[path] = {
            "name": m.group("name").strip(),
            "stype": m.group("stype").strip(),
            "complexity": m.group("cx").strip(),
            "caps": m.group("caps").strip(),
        }
    return meta


def classify(stype: str) -> str:
    s = stype.lower()
    if "agentic ui" in s or "ag-ui" in s:
        return "agentic-ui"
    if "multi-agent" in s or "multi agent" in s:
        return "multi"
    if "workflow" in s and "agent" not in s:
        return "workflow"
    if "workflow" in s:
        return "hybrid"
    return "agent"


def is_l5(cx: str) -> bool:
    return "l5" in cx.lower() or "level 5" in cx.lower()


def parse_readme_header(readme: str) -> dict[str, str]:
    """Fallback metadata from project README front-matter lines."""
    out: dict[str, str] = {}
    for line in readme.splitlines()[:12]:
        if ":" in line and any(
            line.startswith(p)
            for p in ("System Type:", "Complexity:", "Industry:", "Capabilities:")
        ):
            k, _, v = line.partition(":")
            out[k.strip()] = v.strip()
    return out


def domain_apis(domain: str, caps: str, name: str) -> list[str]:
    """Short list of plausible external APIs — tailored by domain."""
    c = caps.lower()
    n = name.lower()
    apis: list[str] = []

    def add(*items: str) -> None:
        for it in items:
            if it not in apis:
                apis.append(it)

    if domain in ("travel",):
        add("Duffel / Amadeus / airline NDC (availability-dependent)", "Google Places & Routes or Mapbox (routing, POI hours)", "Weather APIs for outdoor risk")
    if domain in ("logistics", "logistics-ai"):
        add("Maps / distance-matrix APIs", "TMS / carrier webhooks", "ERP or WMS export APIs where relevant")
    if domain in ("fintech", "finance"):
        add("Stripe / payment processor APIs", "Plaid or bank aggregation (if permitted)", "Core ledger / accounting webhooks")
    if domain in ("healthcare", "health-ai"):
        add("FHIR R4 endpoints (Epic / Cerner sandboxes for build)", "HIPAA-aligned BAA vendors only for PHI")
    if domain in ("devtools", "devops", "devtools-ai"):
        add("GitHub / GitLab / Azure DevOps REST APIs", "CI provider APIs (GitHub Actions, CircleCI)", "Package registry APIs where relevant")
    if domain in ("security", "security-ai"):
        add("SIEM ingestion (Splunk HEC, Elastic, Datadog Logs)", "IdP / SCIM (Okta, Entra) for RBAC", "Cloud audit / CSP APIs for posture")
    if domain in ("productivity", "workflows", "support"):
        add("Gmail / Microsoft Graph mail & calendar", "Slack / Teams webhooks & bot APIs", "Notion / Jira / Linear REST")
    if domain in ("ecommerce",):
        add("Shopify / commerce platform Admin API", "Stripe", "Review / feed APIs for social proof")
    if domain in ("marketing", "sales", "media", "creator-ai"):
        add("SendGrid / SES / customer.io for outbound", "Meta / Google Ads APIs (only if ads are in-scope)", "YouTube / podcast hosting APIs when media ingestion applies")
    if domain in ("enterprise", "enterprise-ai", "hr"):
        add("Workday / BambooHR / Greenhouse-style APIs (pick what your org uses)", "Slack / Teams", "Google Drive / SharePoint for doc sources")
    if domain == "agentic-ui":
        add("Your product REST/GraphQL (BFF-proxied)", "OIDC / session-bound analytics or CRM endpoints", "Webhooks for async jobs (exports, simulations)")
    if domain in ("iot", "energy-ai", "industrial-ai", "agri-ai"):
        add("MQTT / device telemetry brokers", "Time-series or historian APIs", "Weather or grid data feeds where relevant")
    if domain in ("legal", "legal-ai"):
        add("E-signature provider APIs (DocuSign, Dropbox Sign)", "DMS / CMS search APIs", "Court / filing portals only where licensed")
    if domain in ("real-estate",):
        add("MLS / listing feeds (license-dependent)", "Maps APIs", "CRM (HubSpot, Salesforce) if broker workflow")
    if domain in ("web3",):
        add("Ethereum / L2 JSON-RPC or Alchemy/Infura", "WalletConnect or embedded wallet SDKs")
    if domain in ("voice", "ai-interface"):
        add("Twilio Voice / WebRTC SFU", "Deepgram / AssemblyAI for streaming ASR", "OpenAI Realtime or equivalent TTS/STS")
    if domain in ("ai-infra", "platform", "ai-core"):
        add("OpenAI / Anthropic / multi-vendor model APIs", "Kubernetes or Docker APIs if self-hosted", "OIDC provider for tool consent")

    if "slack" in c or "teams" in c:
        add("Slack Bolt / Microsoft Graph")
    if "stripe" in n or "payment" in n:
        add("Stripe")
    if "calendar" in n or "scheduling" in n:
        add("Google Calendar / Microsoft Graph calendar")
    if not apis:
        add("HTTPS webhooks for your system of record", "OIDC / JWT-based auth on your API surface")
    return apis


def open_source_blocks(kind: str, needs_rag: bool, needs_mcp: bool, copilot: bool) -> list[str]:
    lines: list[str] = []
    if kind == "workflow":
        lines += [
            "- **n8n** — fast integration fabric when the blueprint is connector-heavy and ops wants visibility.",
            "- **Temporal + TypeScript SDK** — when you need durable timers, saga compensation, and strict replay semantics.",
            "- **BullMQ + Redis** — lighter option for queue-backed steps without full Temporal yet.",
        ]
    elif kind == "multi":
        lines += [
            "- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.",
            "- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.",
        ]
    elif kind == "hybrid":
        lines += [
            "- **Temporal or n8n** for the deterministic spine; **OpenAI Agents SDK** or **LangChain.js** for LLM steps inside activities.",
            "- **Vercel AI SDK** if a Next.js surface streams partial results to users.",
        ]
    elif kind == "agentic-ui":
        lines += [
            "- **CopilotKit** — primary AG-UI runtime: shared UI↔agent state, safer action wiring than ad-hoc chat bridges.",
            "- **Vercel AI SDK** — streaming tokens and structured data parts for side panels and inline chips.",
            "- **Tailwind + TanStack Query + Zustand** — responsive dashboards/editors with explicit selection/canvas state.",
        ]
    else:
        lines += [
            "- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.",
            "- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.",
            "- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.",
        ]
    if copilot and kind != "agentic-ui":
        lines.append(
            "- **CopilotKit** — in-app copilot state, shared context with React, safer UI action wiring."
        )
    lines += [
        "- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.",
        "- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.",
    ]
    if needs_rag:
        lines += [
            "- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.",
            "- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.",
        ]
    if needs_mcp:
        lines.append(
            "- **MCP TypeScript SDK** — expose tools/resources to other clients or consume a curated MCP hub for interoperability."
        )
    lines += [
        "- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.",
        "- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.",
        "- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.",
    ]
    return lines


def build_readme_enrichment(
    path_key: str,
    meta: dict[str, str],
    header: dict[str, str],
) -> str:
    name = meta.get("name") or path_key.split("/")[-1].replace("-", " ").title()
    stype = meta.get("stype") or header.get("System Type", "Agent")
    cx = meta.get("complexity") or header.get("Complexity", "L3")
    caps = meta.get("caps") or header.get("Capabilities", "")
    parts = path_key.split("/")
    domain = parts[1] if len(parts) > 1 else "general"
    kind = classify(stype)
    needs_rag = "rag" in caps.lower() or "retrieval" in caps.lower()
    needs_mcp = "mcp" in caps.lower() or "tool registry" in name.lower() or "registry" in name.lower()
    copilot = domain == "agentic-ui" or kind == "agentic-ui" or "copilot" in name.lower() or "in-app" in name.lower()
    l5 = is_l5(cx)

    apis = domain_apis(domain, caps, name)
    os_lines = open_source_blocks(kind, needs_rag, needs_mcp, copilot)

    # Recommended stack bullets — one line reasoning each
    stack: list[str] = []
    if domain in ("agentic-ui", "frontend") or "next" in caps.lower():
        stack.append(
            "- **Next.js + React** — app shell, auth, and streaming UX align with how most TypeScript teams ship user-facing agents."
        )
    else:
        stack.append(
            "- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead."
        )
    if kind == "workflow":
        stack.append(
            "- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history."
        )
    elif kind == "multi":
        stack.append(
            "- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent."
        )
    elif kind == "agentic-ui":
        stack.append(
            "- **CopilotKit + OpenAI Agents SDK** — UI state and tool calls stay aligned; Vercel AI SDK handles streaming presentation layers."
        )
    else:
        stack.append(
            "- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters."
        )
    stack.append(
        "- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools."
    )
    stack.append(
        "- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early."
    )
    stack.append(
        "- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material."
    )
    if l5:
        stack.append(
            "- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints."
        )
    else:
        stack.append(
            "- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools."
        )
    stack.append(
        "- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts."
    )

    # Stack choice guide
    if kind == "workflow":
        default_s = "**Best default:** Node worker + Postgres + Redis + Temporal (or n8n if integrations dominate) — auditable steps and retries match workflow-first designs."
        light_s = "**Lightweight:** Hono + BullMQ + Postgres — ship a weekend MVP with cron + queue, migrate to Temporal when sleeps and compensations hurt."
        prod_s = "**Production-heavy:** Temporal Cloud + OTel + separate ingest workers + multi-region Postgres (read replicas) when SLAs and replay volume demand it."
    elif kind == "multi":
        default_s = "**Best default:** Node service + OpenAI Agents SDK + Postgres state store + Redis queue for async specialist work + OTel traces — fits handoff-heavy blueprints."
        light_s = "**Lightweight:** Single Node process + in-memory queue for demos; still use Zod schemas and one Postgres schema for trip/issue graph state."
        prod_s = "**Production-heavy:** LangGraph for explicit graph control + dedicated worker pool per agent family + strict RBAC on tools + eval harness in CI."
    elif kind == "agentic-ui":
        default_s = "**Best default:** Next.js + CopilotKit + Vercel AI SDK + OpenAI Agents SDK + Postgres + Redis + OTel — the baseline AG-UI stack in this repo."
        light_s = "**Lightweight:** Vite/React demo + mocked BFF + single Postgres; prove selection→grounded tool loop before hardening."
        prod_s = "**Production-heavy:** Split BFF and inference workers, online evals for UI mutations, feature flags for risky tools, CRDT/OT where collaborative editing matters."
    else:
        default_s = "**Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo."
        light_s = "**Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it."
        prod_s = "**Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools."

    build_notes = [
        "**Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.",
        "**Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.",
        "**Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.",
    ]
    if l5:
        build_notes.append(
            "**L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations."
        )

    api_bullets = "\n".join(f"- {a}" for a in apis[:10])

    os_body = "\n".join(os_lines)

    stack_body = "\n".join(stack)

    body = f"""
{README_MARKER}

### Recommended Stack
Tailored for **{name}** ({stype}, {cx}): prioritize components that match **{kind}** orchestration and the **{domain}** integration surface.

{stack_body}

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

{api_bullets}

### Open Source Building Blocks
{os_body}

### Stack Choice Guide
- {default_s}
- {light_s}
- {prod_s}

### Buildability Notes
{chr(10).join('- ' + b for b in build_notes)}
"""
    return body.rstrip() + "\n"


def build_arch_enrichment(
    path_key: str,
    meta: dict[str, str],
    header: dict[str, str],
) -> str:
    name = meta.get("name") or path_key
    stype = meta.get("stype") or header.get("System Type", "Agent")
    caps = meta.get("caps") or ""
    kind = classify(stype)
    needs_rag = "rag" in caps.lower() or "retrieval" in caps.lower()
    l5 = is_l5(meta.get("complexity") or "")

    auth_note = (
        "RBAC + scoped API keys + audit logs on every tool invocation; MCP-style tool manifests if multiple clients consume the same backend."
        if kind == "multi" or "security" in path_key
        else "Session-based auth for UI; service-to-service JWT or mTLS between workers; least-privilege OAuth scopes for SaaS tools."
    )

    orch = (
        "Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs."
        if kind == "workflow"
        else "Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch."
    )

    return f"""
---

{ARCH_MARKER}

### Recommended Technical Architecture
Concrete layers for **{name}**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** {orch}
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:**{" Postgres + pgvector with ACL-aware retrieval + citation payloads." if needs_rag else " Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement."}
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** {auth_note}

### Suggested Data and Infra Layer
- **Postgres** for canonical entities, workflow checkpoints, and audit trails.
- **Redis** for dedupe keys, locks, rate limits, and short TTL caches of vendor responses where safe.
- **Object storage** for attachments, exports, and large model outputs referenced by URL.
- **Queue / worker** (BullMQ, SQS, or Temporal activities) for anything exceeding interactive latency budgets.
- **Cron / scheduled jobs** for polling mailboxes, refreshing embeddings, or reconciliation tasks when the blueprint needs them.

### Suggested Runtime and Deployment
- **Next.js on Vercel** when users interact through a browser and you want edge-friendly auth and streaming.
- **Node.js services on Fly.io / Railway / Render / Docker** for webhooks, background agents, and long CPU/GPU steps that exceed serverless limits.
- **Separate worker processes** for ingestion, indexing, and batch eval — keeps user-facing APIs responsive.

### Testing and Evaluation Strategy
- **Vitest** for pure functions, schema validation, and policy engines without network.
- **Contract tests** for outbound HTTP using recorded fixtures; **tool mocks** for LLM unit tests.
- **Structured output snapshots** (JSON Schema validation) instead of brittle full-text asserts.
- **Eval sets** (golden inputs) with regression checks in CI once prompts stabilize.
- **Latency & cost telemetry** compared per release; alert on p95 regressions for critical flows.
{"- **Human review queues** with sampling for high-risk outputs (finance, health, security)." if l5 or "health" in path_key or "fintech" in path_key or "security" in path_key else ""}

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
""".rstrip() + "\n"


def insert_after_stack_section(readme: str, block: str) -> str:
    lines = readme.splitlines(keepends=True)
    start = None
    for i, line in enumerate(lines):
        if line.startswith("## 🛠️ Suggested TypeScript Stack"):
            start = i
            break
    if start is None:
        return readme
    insert_at = None
    for j in range(start + 1, len(lines)):
        if lines[j].startswith("## ") and not lines[j].startswith("###"):
            insert_at = j
            break
    if insert_at is None:
        insert_at = len(lines)
    # Ensure blank line before block
    prefix = lines[:insert_at]
    if prefix and not prefix[-1].endswith("\n\n") and not prefix[-1].strip() == "":
        prefix.append("\n")
    return "".join(prefix) + "\n" + block + "\n" + "".join(lines[insert_at:])


def append_architecture(arch: str, block: str) -> str:
    arch = arch.rstrip() + "\n"
    if arch.endswith("\n\n"):
        pass
    return arch + "\n" + block


def main() -> None:
    catalog = parse_catalog()
    touched_r = touched_a = skipped = 0
    for readme_path in sorted(PROJECTS.glob("**/README.md")):
        rel = readme_path.relative_to(ROOT).as_posix()
        key = str(readme_path.parent.relative_to(PROJECTS))
        path_key = f"projects/{key}"
        arch_path = readme_path.parent / "architecture.md"
        readme = readme_path.read_text(encoding="utf-8")
        if README_MARKER in readme:
            skipped += 1
            continue
        meta = catalog.get(path_key, {})
        header = parse_readme_header(readme)
        block = build_readme_enrichment(path_key, meta, header)
        new_readme = insert_after_stack_section(readme, block)
        readme_path.write_text(new_readme, encoding="utf-8")
        touched_r += 1

        if arch_path.is_file():
            arch = arch_path.read_text(encoding="utf-8")
            if ARCH_MARKER not in arch:
                arch_block = build_arch_enrichment(path_key, meta, header)
                arch_path.write_text(append_architecture(arch, arch_block), encoding="utf-8")
                touched_a += 1
    print(f"README enriched: {touched_r}, architecture enriched: {touched_a}, skipped (already): {skipped}")


if __name__ == "__main__":
    main()
