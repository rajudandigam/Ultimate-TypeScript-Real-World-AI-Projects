### 1. System Overview
**IOC bus** ingests from email gateway, browser telemetry, or threat intel. **Case service** tracks lifecycle states. **Outbound mailer** is isolated with rate limits and DKIM for abuse desk identity.

### 2. Architecture Diagram (text-based)
```
IOC → agent (tools) → evidence bundle → human approve
                         ↓
              provider APIs / email → status polling
```

### 3. Core Components
Sandbox fetcher with egress allowlist, artifact vault, RBAC for send rights, audit log immutable, registrar response parsers

### 4. Data Flow
Normalize URL → passive DNS → fetch safe screenshot hash → assemble bundle → score → queue → on approve dispatch → poll until terminal state → close metrics

### 5. Agent Interaction
Agent cannot send mail without signed approval token in workflow context

### 6. Scaling Considerations
Burst campaigns: dedupe by URL hash; shard workers by tld; backoff on provider 429; cache RDAP responses with TTL

### 7. Failure Modes
Provider API schema drift; false cluster merges; leaked credentials in screenshots—schema tests, manual split tool, secret redactor

### 8. Observability Considerations
Cases opened/closed per day, provider response latency, human edit rate on drafts, tool error taxonomy, cost per successful takedown
