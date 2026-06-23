// Client-side moderation: first line of defence before the submission reaches
// the server. The Appwrite Function `on-submission-created` runs a second,
// authoritative check using the OpenAI Moderation API (see developer_docs.md).

const BLOCKED_PATTERNS: RegExp[] = [
  // common slurs — extend this list as needed
  /\bn[\*i]gg(a|er|as|ers)\b/i,
  /\bf[*a]gg?[oi]t\b/i,
  /\bk[*i]ke\b/i,
  /\bch[*i]nk\b/i,
  /\bsp[*i]c\b/i,
  /\bretard(ed)?\b/i,
  /\bc[*u]nt\b/i,
  // NSFW / harmful intent phrases
  /\b(how\s+to\s+)?((make|build|create)\s+)?(a\s+)?(bomb|explosive|weapon)\b/i,
  /\b(child|kiddie)\s*(porn|sex)\b/i,
  /\bcp\b.*\b(link|download|share)\b/i,
];

export interface ModerationResult {
  flagged: boolean;
  reason: string | null;
}

export function moderateText(text: string): ModerationResult {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, reason: 'Your submission contains content that violates our community guidelines.' };
    }
  }
  return { flagged: false, reason: null };
}

// Runs moderation across all text fields of a submission at once.
export function moderateSubmission(fields: Record<string, string>): ModerationResult {
  for (const [, value] of Object.entries(fields)) {
    const result = moderateText(value);
    if (result.flagged) return result;
  }
  return { flagged: false, reason: null };
}
