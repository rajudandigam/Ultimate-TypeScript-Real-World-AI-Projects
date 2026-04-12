### 1. System Overview
**Episode ingest** → **transcribe workflow** → **Insight Agent** structures JSON → **editor** approves → **publisher** updates show notes / chapter markers in hosting API.

### 2. Architecture Diagram (text-based)
```
Audio → ASR/diarize → Insight Agent
        ↓
Chapters/summary JSON → CMS → RSS refresh
```

### 3. Core Components
Storage, transcription workers, agent BFF, editor UI, hosting API adapter, CDN for transcripts

### 4. Data Flow
Fetch audio → transcribe with speaker labels → chunk for LLM budget → assemble structured output → validate schema → preview

### 5. Agent Interaction
Single agent; quotes must include start/end offsets validated against transcript

### 6. Scaling Considerations
Long episodes chunked; parallel language tracks; cache transcripts by file hash

### 7. Failure Handling
Low-confidence diarization → mark unknown speaker; ASR fail → retry alternate engine flag

### 8. Observability
ASR minutes, LLM tokens per episode, publish success, listener CTR on chapters if measurable
