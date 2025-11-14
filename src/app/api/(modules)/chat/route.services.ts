import {
  buildSystemPrompt,
  convertToGeminiFormat,
  getNoteOverview,
  getRelevantNotes,
  sanitizeChatHistory,
} from "@/app/api/core/utils/chat";
import { notesIndex } from "@/app/api/core/utils/db/pinecone";
import getGeminiClient, { getEmbedding } from "@/app/api/core/utils/gemini";

import { ChatMessage, TrialNoteForChat } from "./route.types";

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

/**
 * Process chat request for trial users with local notes
 * NOW SUPPORTS SEMANTIC SEARCH with Pinecone embeddings!
 * Trial users get the same AI-powered search as authenticated users
 */
export async function processChatRequestTrial(
  messages: ChatMessage[],
  trialNotes: TrialNoteForChat[],
): Promise<ReadableStream<Uint8Array>> {
  // Truncate to last 6 messages for context management
  const messagesTruncated = messages.slice(-6);

  // Build trial note context
  const overview = {
    totalCount: trialNotes.length,
    titles: trialNotes.map((note) => ({
      title: note.title,
      createdAt: new Date(note.createdAt),
    })),
  };

  // Generate embedding for semantic search (same as authenticated users!)
  const embedding = await getEmbedding(
    messagesTruncated.map((message) => message.content).join("\n"),
  );

  // Search in Pinecone for trial notes using special "trial-user" userId
  // Trial notes are stored with userId: "trial-user" in Pinecone
  const queryResponse = await notesIndex.query({
    vector: embedding,
    topK: 3,
    filter: { userId: { $eq: "trial-user" } }, // Only get trial notes
  });

  // Map Pinecone results to trial notes
  const relevantNoteIds = queryResponse.matches.map((match) => match.id);
  const relevantNotes = trialNotes
    .filter((note) => relevantNoteIds.includes(note.id))
    .map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
    }));

  // If no relevant notes found via Pinecone, fallback to first 3 notes
  const notesForContext =
    relevantNotes.length > 0
      ? relevantNotes
      : trialNotes.slice(0, 3).map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
        }));

  // Build system prompt with context
  const systemPrompt = buildSystemPrompt(overview, notesForContext);

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
