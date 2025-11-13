import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

import { searchNotes } from "@/app/api/(modules)/notes/search/route.services";
import { NoteSortBy } from "@/app/api/(modules)/notes/search/route.types";
import AddEditNoteDialog from "./components/molecules/AddEditNoteDialog/AddEditNoteDialog";
import AIChatBox from "./components/organisms/AIChatBox/AIChatBox";
import NotesGrid from "./components/organisms/NotesGrid/NotesGrid";

export const metadata: Metadata = {
  title: "Lio | AI Notes",
};

// Force dynamic rendering - always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  query?: string;
  sortBy?: string;
  page?: string;
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { userId } = await auth();

  if (!userId) throw Error("userId undefined");

  // Await searchParams in Next.js 15+
  const params = await searchParams;

  const query = params.query || "";
  const sortBy = (params.sortBy || "updated-desc") as NoteSortBy;
  const page = parseInt(params.page || "1");
  const pageSize = 12;

  // Use backend service to fetch, filter, sort, and paginate notes
  const result = await searchNotes({
    userId,
    query,
    sortBy,
    page,
    pageSize,
  });

  return (
    <>
      <NotesGrid
        notes={result.notes}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        totalCount={result.total}
        initialQuery={query}
        initialSort={sortBy}
      />

      <AddEditNoteDialog />
      <AIChatBox />
    </>
  );
}
