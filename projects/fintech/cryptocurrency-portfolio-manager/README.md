System Type: Agent  
Complexity: Level 3  
Industry: Fintech  
Capabilities: Optimization, Tracking  

# Cryptocurrency Portfolio Manager

## 🧠 Overview
A **read-heavy portfolio agent** that aggregates **on-chain and exchange balances** via APIs, tracks **cost basis** inputs you supply (or CSV), and suggests **rebalance drafts** with **tax-awareness flags** (wash sale / lot selection heuristics as **non-legal** hints)—**never** custodies keys in the LLM; use **vault/HSM** or **read-only** keys per security model.

---

## 🎯 Problem
Users hold assets across chains and CEXs; tax and allocation drift are painful. LLM must not invent balances.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `list_positions`, `fetch_prices`, `propose_rebalance` (validated).

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-chain reads + memory of user preferences.

---

## 🏭 Industry
Fintech / crypto portfolio tooling.

---

## 🧩 Capabilities
Optimization, Tracking, Personalization, Observability.

---

## 🛠️ Suggested TypeScript Stack
**viem**/**ethers**, exchange REST, **Postgres**, **Node.js**, **OpenAI SDK** for explanations only.

---

## 🧱 High-Level Architecture
Wallet connectors (read) + CEX OAuth → balance aggregator → agent → UI; optional signing in **client** or **custodial** service outside LLM.

---

## 🔄 Implementation Steps
Manual CSV → CEX read-only → chain reads → price oracle → rebalance math in code → agent narrates.

---

## 📊 Evaluation
Balance accuracy vs explorers, tax export correctness on fixtures, user edits to proposals.

---

## ⚠️ Challenges & Failure Cases
**Wrong chain** selection; oracle stale; **key leak** if mishandled—use vault patterns. Regulatory uncertainty—geo block. RPC rate limits.

---

## 🏭 Production Considerations
Secrets, audit, region locks, ToS for data providers, incident response for key compromise, no seed phrases in logs.

---

## 🚀 Possible Extensions
DeFi position decoding, staking rewards, tax software CSV export.

---

## 🔁 Evolution Path
Read-only dashboard → suggestions → signed txs via dedicated signer service (not LLM).

---

## 🎓 What You Learn
Multi-chain integration, separating signing from reasoning, portfolio UX safety.
