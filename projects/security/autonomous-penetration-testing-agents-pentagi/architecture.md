### 1. System Overview
**Lab orchestrator** provisions targets from IaC. **Supervisor agent** enforces **scope tokens**. **Worker agents** run in **microVMs** with **egress deny by default** except allowlisted scanner endpoints.

### 2. Architecture Diagram (text-based)
```
Scope → lab provision → recon agent → validator agent
                         ↓
              findings DB → report agent → human release
```

### 3. Core Components
Policy compiler, execution sandbox, secrets vault, artifact store (pcaps, HAR), ticketing integration, audit service

### 4. Data Flow
Signed scope JSON → compile ACLs → dispatch jobs → stream events to SIEM test sink → aggregate findings with CWE/CVE links → export SARIF + narrative

### 5. Agent Interaction
Agents cannot read each other’s scratch memory; only structured bus messages; supervisor can hard-stop all runners

### 6. Scaling Challenges
Parallel chains vs CPU; noisy neighbor in shared lab; long-running scans need checkpoint/resume

### 7. Failure Handling
Any scope parse error → refuse start; exploit tool crash → isolated restart; leak detection heuristics abort run

### 8. Observability Considerations
Per-agent tool latency, egress attempts blocked, finding severity mix, human override reasons, $/engagement vs traditional pentest baseline
