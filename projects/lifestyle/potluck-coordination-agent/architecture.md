### 1. System Overview
**Event aggregate** holds RSVPs and dish claims. **Orchestrator** runs assignment rounds; **lock service** prevents edits after cutoff unless host unlocks.

### 2. Architecture Diagram (text-based)
```
RSVP API → menu architect → assignment → mediator rounds
                    ↓
              locked roster → reminders
```

### 3. Core Components
Auth (magic links), constraint validator (deterministic), LLM negotiators, audit trail, export (PDF/ICS attachment optional)

### 4. Data Flow
Collect intents → validate allergens → initial slotting → detect conflicts → mediator proposes swaps → host confirms → notify guests

### 5. Agent Interaction
Round-based: each agent returns structured JSON; orchestrator rejects invalid moves; max 3 negotiation rounds then escalate to host

### 6. Scaling Considerations
Large events (200+ guests) need batching and category sharding; email fan-out via queue; idempotent RSVP writes

### 7. Failure Scenarios
Split-brain double claims → optimistic locking + retry; LLM proposes non-food item → schema validator drops; reminder spam → digest mode

### 8. Observability Considerations
Time-to-locked roster, negotiation round count, tool/LLM errors, notification delivery rate, host override reasons
