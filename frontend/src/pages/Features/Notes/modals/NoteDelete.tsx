import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OykAlert, OykButton, OykModal } from "@/components/ui";
import { ApiError, deleteNote, queryKeys, type TypeNote } from "@/services/api";
import { useTranslation } from "@/services/translation";

export default function OykNotesModalsNoteDelete({
  note,
  setNote,
  spaceId,
}: {
  note: TypeNote | null;
  setNote: (note: TypeNote | null) => void;
  spaceId: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetState = () => {
    setError(null);
    setIsDeleting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isDeleting) return;
    if (!open) {
      setNote(null);
      resetState();
    }
  };

  const handleConfirmDelete = async (close: () => void) => {
    if (!note) return;

    setError(null);
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.notes.list(spaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.spaces.stats(spaceId),
        }),
      ]);
      setNote(null);
      resetState();
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t("Could not delete the note."));
      } else {
        setError(t("Could not delete the note."));
      }
      setIsDeleting(false);
    }
  };

  return (
    <OykModal
      open={Boolean(note)}
      onOpenChange={handleOpenChange}
      title={t("Delete Note")}
      size="sm"
      closable={!isDeleting}
      closeOnBackdrop={!isDeleting}
      content={
        <>
          <p>{t("Are you sure you want to delete this note?")}</p>
          <OykAlert
            title={t("This action is irreversible.")}
            color="warning"
            variant="ghost"
          />
          {error ? (
            <OykAlert title={error} color="danger" variant="ghost" />
          ) : null}
        </>
      }
      actions={({ close }) => (
        <>
          <OykButton
            label={t("Cancel")}
            variant="ghost"
            disabled={isDeleting}
            onClick={close}
          />
          <OykButton
            label={t("Delete")}
            color="danger"
            disabled={isDeleting}
            onClick={() => {
              void handleConfirmDelete(close);
            }}
          />
        </>
      )}
    />
  );
}
