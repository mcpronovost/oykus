import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  deleteEncyclopediaEntry,
  queryKeys,
  type TypeEncyclopediaEntry,
} from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykButton, OykModal } from "@/components/ui";

interface OykEncyclopediaModalsDeleteEntryProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  entry: TypeEncyclopediaEntry | null;
  onDeleted?: () => void;
}

export default function OykEncyclopediaModalsDeleteEntry({
  modalOpen,
  setModalOpen,
  entry,
  onDeleted,
}: OykEncyclopediaModalsDeleteEntryProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const topicSlug = entry?.topic?.slug ?? null;
  const spaceId = entry?.spaceId ?? null;

  const resetState = () => {
    setError(null);
    setIsDeleting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isDeleting) return;
    setModalOpen(open);
    if (!open) resetState();
  };

  const handleConfirmDelete = async (close: () => void) => {
    if (!entry) return;

    setError(null);
    setIsDeleting(true);
    try {
      await deleteEncyclopediaEntry(entry.id);
      const invalidateTasks = [];
      if (spaceId) {
        invalidateTasks.push(
          queryClient.invalidateQueries({
            queryKey: queryKeys.encyclopedia.recent(spaceId),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.encyclopedia.stats(spaceId),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.spaces.stats(spaceId),
          }),
        );
        if (topicSlug) {
          invalidateTasks.push(
            queryClient.invalidateQueries({
              queryKey: queryKeys.encyclopedia.list(spaceId, topicSlug),
            }),
          );
        }
      }
      await Promise.all(invalidateTasks);
      resetState();
      onDeleted?.();
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t("Could not delete the entry."));
      } else {
        setError(t("Could not delete the entry."));
      }
      setIsDeleting(false);
    }
  };

  return (
    <OykModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      title={t("Delete Entry")}
      size="sm"
      color="danger"
      closable={!isDeleting}
      closeOnBackdrop={!isDeleting}
      content={
        <>
          <p>{t("Are you sure you want to delete this entry?")}</p>
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
