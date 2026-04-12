### 1. System Overview
**Edge client** handles capture/playback. **Gateway** maintains **session state** and forwards partial transcripts. **Agent service** streams tokens + tool calls. **Policy** enforces risk tiers per utterance.

### 2. Architecture Diagram (text-based)
```
Mic → ASR stream → voice agent → tools
                 ↓
            TTS stream → speaker (interruptible)
```

### 3. Core Components
VAD module, diarization optional, intent cache, session graph, metrics pipeline, content moderation filters

### 4. Data Flow
Audio chunk → ASR partials → NLU slot fill → agent plan → confirm if needed → execute tool → verbal summary

### 5. Agent Interaction
Single conversational agent; tools are synchronous with short timeouts; high-risk tools require explicit numeric confirm

### 6. Scaling Challenges
WebRTC fanout; bursty concurrent sessions; TTS queueing under load

### 7. Failure Handling
ASR dropout → ask concise repeat; tool timeout → offer SMS/email fallback; network flap → resume session token

### 8. Observability Considerations
Turn latency histograms, barge-in frequency, tool failure taxonomy, moderation triggers, per-locale WER proxies
