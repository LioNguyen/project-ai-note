import { GenerativeModel } from "@google/generative-ai";

import { notesIndex } from "@/app/(backend)/api/core/utils/db/pinecone";
import prisma from "@/app/(backend)/api/core/utils/db/prisma";
import getGeminiClient, {
  getEmbedding,
} from "@/app/(backend)/api/core/utils/openai";
import {
  convertToGeminiFormat,
  sanitizeChatHistory,
  getNoteOverview,
  getRelevantNotes,
  buildSystemPrompt,
} from "@/app/(backend)/api/core/utils/chat";

import {
  ChatMessage,
  GeminiMessage,
  NoteOverview,
  RelevantNote,
} from "./route.types";

/**
 * Process chat request and generate streaming response
 * Handles message truncation, context building, and Gemini API interaction
 */
export async function processChatRequest(
  userId: string,
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  // Truncate to last 6 messages for context management
  const messagesTruncated = messages.slice(-6);

  // Generate embedding for semantic search
  const embedding = await getEmbedding(
    messagesTruncated.map((message) => message.content).join("\n"),
  );

  // Fetch note context
  const [overview, relevantNotes] = await Promise.all([
    getNoteOverview(userId),
    getRelevantNotes(userId, embedding),
  ]);

  // Build system prompt with context
  const systemPrompt = buildSystemPrompt(overview, relevantNotes);

  // Convert and sanitize messages for Gemini
  const geminiMessages = convertToGeminiFormat(messagesTruncated);
  const history = sanitizeChatHistory(geminiMessages);

  // Initialize Gemini chat
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const chat = model.startChat({
    history: history,
  });

  // Send message with context
  const lastMessage = geminiMessages[geminiMessages.length - 1];
  const messageWithContext = systemPrompt + "\n\n" + lastMessage.parts[0].text;

  const result = await chat.sendMessageStream(messageWithContext);

  // Create readable stream for response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return stream;
}
