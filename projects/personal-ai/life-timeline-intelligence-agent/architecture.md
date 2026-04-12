### 1. System Overview
**Vault** stores encrypted events and media references. **Sync service** (optional) uses per-device keys; server sees ciphertext only in strict E2EE mode.

### 2. Architecture Diagram (text-based)
```
Connectors → normalize → event graph → timeline agent
                     ↓
              local UI + optional sync
```

### 3. Core Components
Connector SDK, dedupe engine, face clustering (on-device optional), export packager, consent registry, parental controls

### 4. Data Flow
User authorizes source → incremental import → extract events → propose merges → user confirms → index for search → agent queries via tool API

### 5. Agent Interaction
Agent reads redacted snippets; cannot exfiltrate raw exports; tool responses omit other household members unless scoped

### 6. Scaling Strategy
Large photo libraries: background indexing; incremental EXIF pass; cap graph traversal depth; compress old months to rollups

### 7. Failure Modes
Corrupt backup; timezone ambiguity across flights—manual correction UX, “uncertain time” flags

### 8. Observability Considerations
Import duration, index size, query latency, crash-free sessions, opt-in telemetry only
