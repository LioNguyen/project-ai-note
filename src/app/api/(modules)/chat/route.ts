import { auth } from "@clerk/nextjs/server";

import { processChatRequest } from "./route.services";
import { ChatRequest } from "./route.types";

/**
 * POST /api/chat
 * Process chat messages with AI assistant using note context
 */
export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { messages } = body;

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
