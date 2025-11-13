/**
 * Chat message structure
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Trial note structure for chat context
 */
export interface TrialNoteForChat {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request body for chat endpoint
 */
export interface ChatRequest {
  messages: ChatMessage[];
  trialNotes?: TrialNoteForChat[]; // Optional trial notes for unauthenticated users
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
