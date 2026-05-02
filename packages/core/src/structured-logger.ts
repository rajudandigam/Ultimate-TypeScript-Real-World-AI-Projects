export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogFields {
  [key: string]: unknown;
}

export interface StructuredLogger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

export interface StructuredLoggerOptions {
  correlationId?: string;
  runId?: string;
  /** Override sink (default: console). */
  sink?: (line: string) => void;
  /** Clock for tests. */
  now?: () => number;
}

/**
 * Writes one JSON object per line. Intended for log aggregators.
 */
export function createStructuredLogger(
  base: StructuredLoggerOptions = {},
): StructuredLogger {
  const sink = base.sink ?? ((line: string) => console.log(line));
  const now = base.now ?? (() => Date.now());

  const emit = (level: LogLevel, message: string, fields?: LogFields) => {
    const record: Record<string, unknown> = {
      ts: now(),
      level,
      message,
      ...(base.correlationId !== undefined
        ? { correlationId: base.correlationId }
        : {}),
      ...(base.runId !== undefined ? { runId: base.runId } : {}),
      ...fields,
    };
    sink(JSON.stringify(record));
  };

  return {
    debug: (message, fields) => emit("debug", message, fields),
    info: (message, fields) => emit("info", message, fields),
    warn: (message, fields) => emit("warn", message, fields),
    error: (message, fields) => emit("error", message, fields),
  };
}
