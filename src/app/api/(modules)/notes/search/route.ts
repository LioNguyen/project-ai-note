import { requireAuth } from "@/app/api/core/utils/auth";
import { NextRequest } from "next/server";

import { searchNotes } from "./route.services";
import { NoteSortBy } from "./route.types";

/**
 * GET /api/notes/search
 * Search and filter notes with optional sorting
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const sortBy = (searchParams.get("sortBy") || "updated-desc") as NoteSortBy;

    const result = await searchNotes({ userId, query, sortBy });

    return Response.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
