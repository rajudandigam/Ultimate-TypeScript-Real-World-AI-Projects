/** Role in a multi-agent or chat-style exchange (extensible). */
export type AgentRole = "system" | "user" | "assistant" | "tool" | string;

export interface AgentMessage {
  role: AgentRole;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface AgentHandoff {
  fromRole: AgentRole;
  toRole: AgentRole;
  reason: string;
  payload?: unknown;
}

export interface AgentDecision {
  /** What the agent chose to do next (domain-specific strings allowed). */
  decision: "continue" | "handoff" | "terminate" | string;
  rationale: string;
  payload?: unknown;
}
