System Type: Agent  
Complexity: Level 3  
Industry: DevTools / SRE  
Capabilities: Risk analysis  

# Schema Migration Safety Agent

## 🧠 Overview
Analyzes **SQL/ORM migrations** (Flyway, Prisma, Liquibase, Rails) across **branches** to **predict breaking changes**: dropped columns still read by services, **unsafe defaults**, **long-running locks**, **backfill** hazards—pairs with **CI** to **block merges** or require **expand–contract playbooks** with **generated rollback notes**.

---

## 🎯 Problem
“Small” migrations take down production: missing index on FK add, NOT NULL without default, or service still expecting removed JSON keys.

---

## 💡 Why This Matters
- **Pain it removes:** Sev-1 deploys and multi-hour rollbacks.
- **Who benefits:** Platform teams and service owners in microservice monorepos.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **static analysis + SQL AST tools**; final verdict merges **deterministic rules** with **LLM explanations** for developer UX.

---

## ⚙️ Complexity Level
**Target:** Level 3 — repo-wide dependency graph + migration diff semantics.

---

## 🏭 Industry
Developer infrastructure

---

## 🧩 Capabilities
Risk analysis, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, libpg-query / sql-parser, Prisma migrate diff, GitHub/GitLab APIs, Postgres EXPLAIN harness on ephemeral DBs, OpenAI SDK, OpenTelemetry

---

## 🧱 High-Level Architecture
PR opened → fetch migration files + **service ORM usage index** (prior batch job) → **Safety Agent** emits **risk report JSON** → status check fails on SEV1 → optional autofix suggestions (separate PR)

---

## 🔄 Implementation Steps
1. SQL AST diff + banned patterns list  
2. Cross-reference TypeScript field usage via ts-morph  
3. Lock time estimator from EXPLAIN on shadow DB  
4. Expand–contract template library per risk class  
5. Org-wide migration scorecard dashboard  

---

## 📊 Evaluation
Prevented incident count (retro tagged), false positive rate on PRs, median time to safe migration, developer override reasons

---

## ⚠️ Failure Scenarios
**Dynamic SQL** invisible to static scan; **multi-region lag** on backfills; ORM **raw queries** bypass—escape hatch with annotated suppressions, code owners, shadow DB size limits

---

## 🤖 Agent breakdown
- **AST diff tool:** structural migration changes.  
- **Usage graph tool:** maps columns to TS types/services.  
- **Risk scorer:** deterministic matrix (severity × likelihood).  
- **Explainer agent:** turns JSON into human steps and links to playbook docs.

---

## 🎓 What You Learn
Database reliability engineering, CI gates for schema, communicating risk without noise
