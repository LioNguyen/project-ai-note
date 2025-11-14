"use client";

import { Note as NoteModel } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(frontend)/core/components/atoms/Card/Card";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import { createAxios } from "@/app/(frontend)/core/utils/api";
import { trackNoteDeleted } from "@/app/(frontend)/core/utils/analytics";
import { useNoteDialogStore } from "../../../stores/useNoteDialogStore";
import { useDeleteConfirmStore } from "../../../stores/useDeleteConfirmStore";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const axios = createAxios();
  const locale = useLocale();
  const t = locales[locale];
  const router = useRouter();
  const { data: session } = useSession();
  const trialStore = useTrialModeStore();
  const openDialog = useNoteDialogStore((state) => state.openDialog);
  const openDeleteDialog = useDeleteConfirmStore((state) => state.openDialog);

  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = new Date(
    wasUpdated ? note.updatedAt : note.createdAt,
  ).toDateString();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dialog
    openDeleteDialog(note.id, note.title, handleDelete);
  };

  const handleDelete = async () => {
    try {
      // Trial mode handling
      if (!session?.user) {
        const success = trialStore.deleteNote(note.id);

        if (!success) {
          throw new Error("Failed to delete note");
        }

        // Track note deletion in trial mode
        trackNoteDeleted(true);
        router.refresh();
        toast.success(t.notes.deleteSuccessfully);
        return;
      }

      // Authenticated user handling
      const response = await axios.delete(`/api/notes/${note.id}`);
      if (response.status !== 200) {
        throw Error("Status code: " + response.status);
      }

      // Track note deletion for authenticated users
      trackNoteDeleted(false);
      router.refresh();
      toast.success(t.notes.deleteSuccessfully);
    } catch (err: any) {
      toast.error(t.notes.somethingWentWrong, {
        type: "error",
      });
      throw new Error(err);
    }
  };

  return (
    <>
      <Card className="group relative flex h-[280px] cursor-pointer flex-col transition-shadow hover:shadow-lg">
        {/* Delete Button - Shows on hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="absolute right-2 top-2 z-10 h-8 w-8 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
          aria-label={t.notes.deleteNote}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Card Content */}
        <div onClick={() => openDialog(note)} className="flex h-full flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="line-clamp-2 pr-8 text-base">
              {note.title}
            </CardTitle>
            <CardDescription>
              {createdUpdatedAtTimestamp}
              {wasUpdated && " (updated)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="prose prose-sm dark:prose-invert line-clamp-6 max-w-none [&>*]:my-1 [&>*]:leading-relaxed [&>code]:rounded [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:text-xs [&>em]:italic [&>h1]:text-base [&>h1]:font-bold [&>h2]:text-sm [&>h2]:font-semibold [&>h3]:text-sm [&>h3]:font-medium [&>ol]:text-sm [&>p]:text-sm [&>p]:text-muted-foreground [&>strong]:font-semibold [&>ul]:text-sm">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
