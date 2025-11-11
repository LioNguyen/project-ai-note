/**
 * Chat message structure
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Request body for chat endpoint
 */
export interface ChatRequest {
  messages: ChatMessage[];
}

/**
 * Gemini-formatted message structure
 */
export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

/**
 * Note overview information for chat context
 */
export interface NoteOverview {
  totalCount: number;
  titles: Array<{ title: string; createdAt: Date }>;
}

/**
 * Relevant note structure for chat context
 */
export interface RelevantNote {
  id: string;
  title: string;
  content: string | null;
}
