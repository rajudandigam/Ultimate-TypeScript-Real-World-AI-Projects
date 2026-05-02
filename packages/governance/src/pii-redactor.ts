/**
 * Heuristic PII detection and redaction for logs, prompts, and previews.
 *
 * **Reference implementation only** — not a Data Loss Prevention (DLP) product,
 * not suitable for HIPAA/SOX/GDPR attestation, and not a substitute for legal
 * review, enterprise redaction pipelines, or vendor DLP. False negatives and
 * false positives are expected.
 */

export type PIIMatchType = "email" | "phone" | "credit_card" | "ssn";

/** Match span in the original string (no raw value stored). */
export interface PIIMatch {
  type: PIIMatchType;
  start: number;
  end: number;
}

type Pattern = { type: PIIMatchType; re: RegExp };

const patterns: Pattern[] = [
  {
    type: "email",
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    type: "ssn",
    re: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    type: "phone",
    re: /\b(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  },
  {
    type: "credit_card",
    /** Groups of digits with optional separators; does not run Luhn. */
    re: /\b(?:\d[ -]*?){15,18}\d\b/g,
  },
];

const priority: Record<PIIMatchType, number> = {
  email: 4,
  ssn: 3,
  credit_card: 2,
  phone: 1,
};

function collectRaw(text: string): PIIMatch[] {
  const raw: PIIMatch[] = [];
  for (const { type, re } of patterns) {
    const r = new RegExp(re.source, re.flags);
    let m: RegExpExecArray | null;
    while ((m = r.exec(text)) !== null) {
      raw.push({ type, start: m.index, end: m.index + m[0].length });
    }
  }
  return raw;
}

function mergeOverlapping(matches: PIIMatch[]): PIIMatch[] {
  if (matches.length === 0) return [];
  const sorted = [...matches].sort(
    (a, b) => a.start - b.start || b.end - a.end,
  );
  const out: PIIMatch[] = [];
  let cur = { ...sorted[0]! };
  for (let i = 1; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (n.start >= cur.end) {
      out.push(cur);
      cur = { ...n };
      continue;
    }
    const mergedStart = Math.min(cur.start, n.start);
    const mergedEnd = Math.max(cur.end, n.end);
    const type =
      priority[n.type] > priority[cur.type]
        ? n.type
        : priority[n.type] < priority[cur.type]
          ? cur.type
          : n.end - n.start > cur.end - cur.start
            ? n.type
            : cur.type;
    cur = { type, start: mergedStart, end: mergedEnd };
  }
  out.push(cur);
  return out;
}

/** Returns merged spans of likely PII (heuristic). */
export function detectPII(text: string): PIIMatch[] {
  return mergeOverlapping(collectRaw(text));
}

const DEFAULT_PLACEHOLDER = "[REDACTED]";

/** Replaces detected spans with a fixed placeholder (end-first to keep indices stable). */
export function redactPII(text: string, placeholder = DEFAULT_PLACEHOLDER): string {
  const matches = [...detectPII(text)].sort((a, b) => b.start - a.start);
  let out = text;
  for (const m of matches) {
    out = out.slice(0, m.start) + placeholder + out.slice(m.end);
  }
  return out;
}
