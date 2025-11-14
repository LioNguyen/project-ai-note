import { getOptionalUserId } from "@/app/api/core/utils/auth";
import { Metadata } from "next";

import { searchNotes } from "@/app/api/(modules)/notes/search/route.services";
import { NoteSortBy } from "@/app/api/(modules)/notes/search/route.types";
import AuthenticatedUserSheet from "@/app/(frontend)/core/components/organisms/AuthenticatedUserSheet/AuthenticatedUserSheet";
import TrialUserSheet from "@/app/(frontend)/core/components/organisms/TrialUserSheet/TrialUserSheet";
import TrialModeBanner from "@/app/(frontend)/core/components/molecules/TrialModeBanner/TrialModeBanner";
import AddEditNoteDialog from "./components/molecules/AddEditNoteDialog/AddEditNoteDialog";
import DeleteConfirmDialog from "./components/molecules/DeleteConfirmDialog/DeleteConfirmDialog";
import TrialLimitDialog from "./components/molecules/TrialLimitDialog/TrialLimitDialog";
import ChatBot from "../(chat-bot)/components/organisms/ChatBot/ChatBot";
import NotesGrid from "./components/organisms/NotesGrid/NotesGrid";
import NotesGridClient from "./components/organisms/NotesGridClient/NotesGridClient";

export const metadata: Metadata = {
  title: "AI Note",
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
  // Allow both authenticated and trial users
  const userId = await getOptionalUserId();

  // Await searchParams in Next.js 15+
  const params = await searchParams;

  const query = params.query || "";
  const sortBy = (params.sortBy || "updated-desc") as NoteSortBy;
  const page = parseInt(params.page || "1");
  const pageSize = 12;

  // If user is authenticated, fetch from database
  if (userId) {
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
        <DeleteConfirmDialog />
        <ChatBot />
        <AuthenticatedUserSheet />
        <TrialLimitDialog />
      </>
    );
  }

  // Trial mode - client-side rendering with localStorage
  return (
    <>
      <TrialModeBanner />
      <NotesGridClient initialQuery={query} initialSort={sortBy} />
      <AddEditNoteDialog />
      <DeleteConfirmDialog />
      <ChatBot />
      <TrialUserSheet />
      <TrialLimitDialog />
    </>
  );
}
