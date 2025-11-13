import { getOptionalUserId } from "@/app/api/core/utils/auth";

import { processChatRequest, processChatRequestTrial } from "./route.services";
import { ChatRequest } from "./route.types";

/**
 * POST /api/chat
 * Process chat messages with AI assistant using note context
 * Supports both authenticated users and trial mode
 */
export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, trialNotes } = body;

    const userId = await getOptionalUserId();

    // Trial mode - use trial notes from request body
    if (!userId) {
      if (!trialNotes) {
        return Response.json(
          { error: "Trial notes required for trial mode" },
          { status: 400 },
        );
      }

      const stream = await processChatRequestTrial(messages, trialNotes);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Authenticated user - fetch notes from database
    const stream = await processChatRequest(userId, messages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
