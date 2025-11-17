"use client";

import { useState } from "react";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import BaseDialog from "@/app/(frontend)/core/components/molecules/BaseDialog/BaseDialog";
import { useTranslation } from "react-i18next";
import { useDeleteConfirmStore } from "../../../stores/useDeleteConfirmStore";

/**
 * DeleteConfirmDialog Component
 * Reusable confirmation dialog for deleting notes
 * Can be triggered from Note card or AddEditNoteDialog
 */
export default function DeleteConfirmDialog() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  const isOpen = useDeleteConfirmStore((state) => state.isOpen);
  const noteTitle = useDeleteConfirmStore((state) => state.noteTitle);
  const onConfirm = useDeleteConfirmStore((state) => state.onConfirm);
  const closeDialog = useDeleteConfirmStore((state) => state.closeDialog);
  const reset = useDeleteConfirmStore((state) => state.reset);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    setIsDeleting(true);
    try {
      await onConfirm();
      reset();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    closeDialog();
  };

  return (
    <BaseDialog
      open={isOpen}
      onOpenChange={handleClose}
      title={t("notes.deleteNote")}
      description={
        noteTitle
          ? `${t("notes.confirmDelete")} "${noteTitle}"?`
          : t("notes.confirmDelete")
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.loading") : t("notes.deleteNote")}
          </Button>
        </>
      }
    />
  );
}
