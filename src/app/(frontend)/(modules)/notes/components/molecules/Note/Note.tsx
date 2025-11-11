"use client";

import { Note as NoteModel } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import { useNoteDialogStore } from "../../../stores/useNoteDialogStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(frontend)/core/components/atoms/Card/Card";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const openDialog = useNoteDialogStore((state) => state.openDialog);

  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = new Date(
    wasUpdated ? note.updatedAt : note.createdAt,
  ).toDateString();

  return (
    <Card
      className="flex h-[280px] cursor-pointer flex-col transition-shadow hover:shadow-lg"
      onClick={() => openDialog(note)}
    >
      <CardHeader className="flex-shrink-0">
        <CardTitle className="line-clamp-2 text-base">{note.title}</CardTitle>
        <CardDescription>
          {createdUpdatedAtTimestamp}
          {wasUpdated && " (updated)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="prose prose-sm dark:prose-invert line-clamp-6 max-w-none text-sm text-muted-foreground [&>*]:my-0 [&>*]:leading-relaxed">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
