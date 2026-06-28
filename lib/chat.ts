export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Keep the last N messages so we stay within OpenAI's context window. */
const MAX_HISTORY_MESSAGES = 20;

export function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  const valid = messages.filter(
    (m) => m.content.trim() && (m.role === "user" || m.role === "assistant")
  );
  if (valid.length <= MAX_HISTORY_MESSAGES) return valid;
  return valid.slice(-MAX_HISTORY_MESSAGES);
}

export function storageKey(personaSlug: string): string {
  return `pitch-persona:${personaSlug}`;
}
