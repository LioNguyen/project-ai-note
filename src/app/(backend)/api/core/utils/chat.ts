import {
  ChatMessage,
  GeminiMessage,
  NoteOverview,
  RelevantNote,
} from "@/app/(backend)/api/chat/route.types";
import { notesIndex } from "@/app/(backend)/api/core/utils/db/pinecone";
import prisma from "@/app/(backend)/api/core/utils/db/prisma";

/**
 * Convert chat messages to Gemini format
 * Maps 'assistant' role to 'model' for Gemini API compatibility
 */
export function convertToGeminiFormat(
  messages: ChatMessage[],
): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

/**
 * Ensure chat history starts with a user message
 * Gemini requires the first message in history to be from user
 */
export function sanitizeChatHistory(
  messages: GeminiMessage[],
): GeminiMessage[] {
  let history = messages.slice(0, -1);

  if (history.length > 0 && history[0].role !== "user") {
    // Find first user message and start from there
    const firstUserIndex = history.findIndex((msg) => msg.role === "user");
    if (firstUserIndex > 0) {
      history = history.slice(firstUserIndex);
    } else {
      // If no user message found in history, use empty history
      history = [];
    }
  }

  return history;
}

/**
 * Fetch overview of all user's notes
 * Includes total count and all note titles with creation dates
 */
export async function getNoteOverview(userId: string): Promise<NoteOverview> {
  const totalCount = await prisma.note.count({
    where: { userId },
  });

  const titles = await prisma.note.findMany({
    where: { userId },
    select: {
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { totalCount, titles };
}

/**
 * Find semantically relevant notes using vector search
 * Uses Pinecone for similarity matching based on query embedding
 */
export async function getRelevantNotes(
  userId: string,
  embedding: number[],
): Promise<RelevantNote[]> {
  const vectorQueryResponse = await notesIndex.query({
    vector: embedding,
    topK: 20,
    filter: { userId },
  });

  const notes = await prisma.note.findMany({
    where: {
      id: {
        in: vectorQueryResponse.matches.map((match) => match.id),
      },
    },
  });

  return notes;
}

/**
 * Build system prompt with note context
 * Includes both overview and semantically relevant notes
 */
export function buildSystemPrompt(
  overview: NoteOverview,
  relevantNotes: RelevantNote[],
): string {
  return (
    "You are an intelligent note-taking app. You answer the user's question based on their existing notes.\n\n" +
    `OVERVIEW: The user has ${overview.totalCount} notes in total.\n` +
    `All note titles: ${overview.titles.map((n) => n.title).join(", ")}\n\n` +
    "RELEVANT NOTES (semantically matched to this query):\n" +
    relevantNotes
      .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
      .join("\n\n") +
    "\n\nInstructions:\n" +
    "- For simple counting questions (e.g., 'how many notes'), use the OVERVIEW information\n" +
    "- For content-specific questions, use the RELEVANT NOTES\n" +
    "- Always respond in the same language as the user's question\n" +
    "- Be concise and helpful"
  );
}
