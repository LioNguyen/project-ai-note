"use client";

import {
  CreateNoteSchema,
  createNoteSchema,
} from "@/app/(backend)/api/core/utils/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { Pencil } from "lucide-react";

import { createAxios } from "@/app/(frontend)/core/utils/api";
import BaseSheet from "@/app/(frontend)/core/components/molecules/BaseSheet/BaseSheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(frontend)/core/components/atoms/Form/Form";
import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import LoadingButton from "@/app/(frontend)/core/components/atoms/LoadingButton/LoadingButton";
import { Textarea } from "@/app/(frontend)/core/components/atoms/Textarea/Textarea";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useNoteDialogStore } from "../../../stores/useNoteDialogStore";

export default function AddEditNoteDialog() {
  const axios = createAxios();
  const locale = useLocale();
  const t = locales[locale];
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use selectors to optimize re-renders
  const isOpen = useNoteDialogStore((state) => state.isOpen);
  const noteToEdit = useNoteDialogStore((state) => state.noteToEdit);
  const closeDialog = useNoteDialogStore((state) => state.closeDialog);

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  // Reset form when noteToEdit changes
  useEffect(() => {
    setIsLoading(true);
    if (noteToEdit) {
      form.reset({
        title: noteToEdit.title,
        content: noteToEdit.content || "",
      });
      setIsEditing(false); // Show preview mode when opening existing note
    } else {
      form.reset({
        title: "",
        content: "",
      });
      setIsEditing(true); // Show edit mode for new note
    }
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [noteToEdit, form]);

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await axios.put("/api/notes", {
          id: noteToEdit.id,
          ...input,
        });
        if (response.status !== 200) {
          throw Error("Status code: " + response.status);
        }
      } else {
        const response = await axios.post("/api/notes", input);
        if (response.status !== 201) {
          throw Error("Status code: " + response.status);
        }
        form.reset();
      }

      router.refresh();
      closeDialog();
      toast.success(t.notes.successfully);
    } catch (err: any) {
      toast.error(t.notes.somethingWentWrong, {
        type: "error",
      });
      throw new Error(err);
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await axios.delete(`/api/notes/${noteToEdit.id}`);
      if (response.status !== 200) {
        throw Error("Status code: " + response.status);
      }

      router.refresh();
      closeDialog();
      toast.success(t.notes.deleteSuccessfully);
    } catch (err: any) {
      toast.error(t.notes.somethingWentWrong, {
        type: "error",
      });
      throw new Error(err);
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <BaseSheet
      open={isOpen}
      onOpenChange={closeDialog}
      title={
        <div className="flex items-center">
          <span>{noteToEdit ? t.notes.editNote : t.notes.addNote}</span>
          {noteToEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              type="button"
            >
              <Pencil size={18} />
            </Button>
          )}
        </div>
      }
      footer={
        <div className="flex gap-2 sm:gap-0 sm:space-x-2">
          {noteToEdit && (
            <LoadingButton
              variant="destructive"
              loading={deleteInProgress}
              disabled={form.formState.isSubmitting}
              onClick={deleteNote}
              type="button"
            >
              {t.notes.deleteNote}
            </LoadingButton>
          )}
          {(isEditing || !noteToEdit) && (
            <LoadingButton
              type="submit"
              form="note-form"
              loading={form.formState.isSubmitting}
              disabled={deleteInProgress}
            >
              {t.notes.submit}
            </LoadingButton>
          )}
        </div>
      }
    >
      {isLoading ? (
        // Loading Skeleton
        <div className="space-y-6">
          {/* Title Skeleton */}
          <div className="rounded-lg bg-muted/50 p-4">
            <Skeleton className="mb-3 h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="rounded-lg bg-muted/50 p-4">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ) : noteToEdit && !isEditing ? (
        // Markdown Preview Mode
        <div className="space-y-6">
          {/* Title Section with Background */}
          <div className="rounded-lg pl-2 pt-2">
            <h3 className="text-xl font-semibold">{form.getValues("title")}</h3>
          </div>

          {/* Content Section with Background */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{form.getValues("content") || ""}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <Form {...form}>
          <form
            id="note-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Title Field with Background */}
            <div className="rounded-lg bg-muted/50 p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t.notes.noteTitle}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.notes.titlePlaceholder}
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Field with Background */}
            <div className="rounded-lg bg-muted/50 p-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t.notes.noteContent}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.notes.contentPlaceholder}
                        {...field}
                        rows={15}
                        className="scrollbar-clean resize-none bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      )}
    </BaseSheet>
  );
}
