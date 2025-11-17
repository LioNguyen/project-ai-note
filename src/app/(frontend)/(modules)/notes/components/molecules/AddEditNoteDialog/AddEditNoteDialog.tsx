"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Eye, FileText, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

import {
  CreateNoteSchema,
  createNoteSchema,
} from "@/app/api/core/utils/validation/note";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
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
import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";
import { Textarea } from "@/app/(frontend)/core/components/atoms/Textarea/Textarea";
import BaseSheet from "@/app/(frontend)/core/components/molecules/BaseSheet/BaseSheet";
import BaseDialog from "@/app/(frontend)/core/components/molecules/BaseDialog/BaseDialog";
import ContentSkeleton from "../../atoms/ContentSkeleton/ContentSkeleton";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import { createAxios } from "@/app/(frontend)/core/utils/api";
import {
  trackNoteCreated,
  trackNoteDeleted,
} from "@/app/(frontend)/core/utils/analytics";
import { useNoteDialogStore } from "../../../stores/useNoteDialogStore";
import { useTrialLimitDialogStore } from "../../../stores/useTrialLimitDialogStore";
import { useDeleteConfirmStore } from "../../../stores/useDeleteConfirmStore";

export default function AddEditNoteDialog() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const axios = createAxios();
  const { t } = useTranslation();
  const locale = useLocale(); // Keep for locale-specific conditional rendering
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const trialStore = useTrialModeStore();

  // Use selectors to optimize re-renders
  const isOpen = useNoteDialogStore((state) => state.isOpen);
  const noteToEdit = useNoteDialogStore((state) => state.noteToEdit);
  const closeDialog = useNoteDialogStore((state) => state.closeDialog);
  const openTrialLimitDialog = useTrialLimitDialogStore(
    (state) => state.openDialog,
  );
  const openDeleteDialog = useDeleteConfirmStore((state) => state.openDialog);

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  // Reset form when noteToEdit changes
  useEffect(() => {
    // If form has unsaved changes when note changes, show confirmation
    if (form.formState.isDirty && noteToEdit) {
      setShowConfirmDialog(true);
      return;
    }

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

  // Handle close with unsaved changes
  const handleCloseDialog = () => {
    // Check if form has unsaved changes
    const hasChanges = form.formState.isDirty;

    if (hasChanges) {
      // Show confirmation dialog
      setShowConfirmDialog(true);
    } else {
      // No changes, close directly
      closeDialog();
    }
  };

  // Confirm close and discard changes
  const confirmClose = () => {
    setShowConfirmDialog(false);
    form.reset(); // Reset form to clear dirty state
    closeDialog();
  };

  async function onSubmit(input: CreateNoteSchema) {
    try {
      // Trial mode handling
      if (!session?.user) {
        if (noteToEdit) {
          // Update existing trial note
          const updatedNote = trialStore.updateNote(
            noteToEdit.id,
            input.title,
            input.content || "",
          );

          if (!updatedNote) {
            throw new Error("Failed to update note");
          }
        } else {
          // Create new trial note
          const newNote = trialStore.createNote(
            input.title,
            input.content || "",
          );

          if (!newNote) {
            // Show trial limit dialog instead of toast
            openTrialLimitDialog();
            return;
          }

          // Track note creation in trial mode
          trackNoteCreated(true);
          form.reset();
        }

        // Refresh the notes list
        trialStore.loadNotes();
        router.refresh();
        closeDialog();
        toast.success(t("notes.successfully"));
        return;
      }

      // Authenticated user handling (existing logic)
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
        // Track note creation for authenticated users
        trackNoteCreated(false);
        form.reset();
      }

      router.refresh();
      closeDialog();
      toast.success(t("notes.successfully"));
    } catch (err: any) {
      toast.error(t("notes.somethingWentWrong"), {
        type: "error",
      });
      throw new Error(err);
    }
  }

  const handleDeleteClick = () => {
    if (!noteToEdit) return;
    openDeleteDialog(noteToEdit.id, noteToEdit.title, deleteNote);
  };

  async function deleteNote() {
    if (!noteToEdit) return;
    try {
      // Trial mode handling
      if (!session?.user) {
        const success = trialStore.deleteNote(noteToEdit.id);

        if (!success) {
          throw new Error("Failed to delete note");
        }

        // Track note deletion in trial mode
        trackNoteDeleted(true);
        router.refresh();
        closeDialog();
        toast.success(t("notes.deleteSuccessfully"));
        return;
      }

      // Authenticated user handling (existing logic)
      const response = await axios.delete(`/api/notes/${noteToEdit.id}`);
      if (response.status !== 200) {
        throw Error("Status code: " + response.status);
      }

      // Track note deletion for authenticated users
      trackNoteDeleted(false);
      router.refresh();
      closeDialog();
      toast.success(t("notes.deleteSuccessfully"));
    } catch (err: any) {
      toast.error(t("notes.somethingWentWrong"), {
        type: "error",
      });
      throw new Error(err);
    }
  }

  return (
    <>
      {/* Unsaved Changes Confirmation Dialog */}
      <BaseDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t("dialog.unsavedChangesTitle")}
        description={t("dialog.unsavedChangesDescription")}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              {t("dialog.continueEditing")}
            </Button>
            <Button variant="destructive" onClick={confirmClose}>
              {t("dialog.discardChanges")}
            </Button>
          </>
        }
      />

      <BaseSheet
        open={isOpen}
        onOpenChange={handleCloseDialog}
        title={
          <div className="flex items-center gap-2.5">
            {noteToEdit ? (
              <FileText className="h-5 w-5 text-primary" />
            ) : (
              <FilePlus className="h-5 w-5 text-primary" />
            )}
            <span className="text-lg font-semibold">
              {noteToEdit ? t("notes.editNote") : t("notes.addNote")}
            </span>
          </div>
        }
        footer={
          <div className="flex gap-2 sm:gap-0 sm:space-x-2">
            {noteToEdit && (
              <Button
                variant="destructive"
                disabled={form.formState.isSubmitting}
                onClick={handleDeleteClick}
                type="button"
              >
                {t("notes.deleteNote")}
              </Button>
            )}
            {(isEditing || !noteToEdit) && (
              <LoadingButton
                type="submit"
                form="note-form"
                loading={form.formState.isSubmitting}
              >
                {t("notes.submit")}
              </LoadingButton>
            )}
          </div>
        }
      >
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-5">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <ContentSkeleton />
            </div>
          </div>
        ) : noteToEdit && !isEditing ? (
          // Markdown Preview Mode
          <div className="space-y-5">
            {/* Title Section with Edit Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("notes.noteTitle")}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  type="button"
                  className="h-8 gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="text-xs">{t("notes.editMode")}</span>
                </Button>
              </div>
              <div className="border-l-4 border-primary py-1 pl-4">
                <h2 className="text-2xl font-bold leading-tight">
                  {form.getValues("title")}
                </h2>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("notes.noteContent")}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-muted/30 p-4 [&>*]:my-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:rounded [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:text-xs [&>em]:italic [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-semibold [&>h3]:text-lg [&>h3]:font-medium [&>li]:text-sm [&>ol]:ml-4 [&>ol]:list-decimal [&>p]:text-sm [&>p]:leading-relaxed [&>pre]:rounded-md [&>pre]:bg-muted [&>pre]:p-3 [&>strong]:font-semibold [&>ul]:ml-4 [&>ul]:list-disc">
                <ReactMarkdown>
                  {form.getValues("content") || "*No content*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <Form {...form}>
            <form
              id="note-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        {t("notes.noteTitle")}
                      </FormLabel>
                      {noteToEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                          type="button"
                          className="h-8 gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {t("notes.previewMode")}
                          </span>
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t("notes.titlePlaceholder")}
                        {...field}
                        className="h-11 text-base focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {t("notes.noteContent")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("notes.contentPlaceholder")}
                        {...field}
                        rows={16}
                        className="scrollbar-clean resize-none text-sm leading-relaxed focus-visible:ring-primary"
                      />
                    </FormControl>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>💡</span>
                      <span>
                        {locale === "vi"
                          ? "Hỗ trợ Markdown: **in đậm**, *in nghiêng*, # tiêu đề"
                          : "Supports Markdown: **bold**, *italic*, # heading"}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </BaseSheet>
    </>
  );
}
