System Type: Workflow  
Complexity: Level 2  
Industry: Security / Privacy  
Capabilities: Extraction, Privacy  

# PII Redaction Gateway

## 🧠 Overview
**Middleware** that sits between **clients and upstream LLM/embedding vendors**, applying **deterministic NER + regex + allowlisted transforms** to **redact or tokenize** PII/PCI-like fields **before** payloads leave trust zone, then **optional de-tokenization** on responses if using **reversible vault tokens** for known entities—designed for **audit logs**, **rate limits**, and **policy packs** per tenant.

---

## 🎯 Problem
Engineering teams paste production logs into copilots; support bots leak emails; DLP alone misses structured JSON fields.

---

## 💡 Why This Matters
- **Pain it removes:** Regulatory exposure and accidental training data leakage to third parties.
- **Who benefits:** Security architects enabling LLM adoption with defensible controls.

---

## 🏗️ System Type
**Chosen:** **Workflow** — parse → classify spans → transform → forward → log metadata (hashed), with **no** model creativity on redaction decisions.

---

## ⚙️ Complexity Level
**Target:** Level 2 — focused gateway with clear policy surface.

---

## 🏭 Industry
Enterprise security

---

## 🧩 Capabilities
Extraction, Privacy, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js proxy (Fastify/Express), Presidio or Microsoft Presidio patterns, WASM for hot paths, HashiCorp Vault for token vault, Redis, OpenTelemetry, JSONPath rules engine

---

## 🧱 High-Level Architecture
Request hits gateway → **redaction workflow** builds transformed body → forwards to model API → optional response pass to strip leaked echoes → returns to client with **redaction manifest** id

---

## 🔄 Implementation Steps
1. JSONPath allowlist/blocklist MVP  
2. Streaming SSE chunk redaction (hard; start buffered)  
3. Per-tenant policy packs (finance vs HR)  
4. Detokenization for internal tools only  
5. SIEM alerts on high-redaction-rate anomalies (possible attack)  

---

## 📊 Evaluation
Recall/precision on labeled payloads, added latency p99, false redaction rate hurting UX, incident count of leaks post-deployment

---

## ⚠️ Challenges & Failure Cases
**Nested JSON** edge paths; multilingual names; **over-redaction** breaking valid JSON—schema-aware walkers, per-locale models, dry-run mode, golden tests per API route

---

## 🏭 Production Considerations
mTLS to LLM vendor, key rotation, no logging of raw payloads, BYOK options, SOC2 evidence exports

---

## 🚀 Possible Extensions
Learning from analyst overrides to suggest new JSONPath rules (human-approved merge)

---

## 🤖 Agent breakdown
No LLM agents on critical path—**policy compiler**, **span classifiers**, and **transformers** are services; optional **LLM policy assistant** drafts YAML off sample traffic in staging only.

---

## 🎓 What You Learn
Privacy engineering for LLM traffic, gateway patterns, compliance-friendly logging
