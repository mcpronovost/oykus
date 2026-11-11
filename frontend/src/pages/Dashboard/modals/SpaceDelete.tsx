import type { SubmitEvent } from "react";
import type { Icon } from "@tabler/icons-react";
import { IconNote } from "@tabler/icons-react";
import { useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OykButton, OykForm, OykList, OykModal } from "@/components/ui";
import { ApiError, deleteSpace, listNotes, queryKeys, type TypeSpace } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";

type TypeDestroyedItem = {
  key: string;
  count: number;
  icon: Icon;
  label: string;
};

export default function OykDashboardModalsSpaceDelete({
  space,
  setSpace,
}: {
  space: TypeSpace | null;
  setSpace: (space: TypeSpace | null) => void;
}) {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const queryClient = useQueryClient();
  const formId = useId();
  const [confirmationName, setConfirmationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: notes = [],
    isPending: isNotesPending,
  } = useQuery({
    queryKey: queryKeys.notes.list(space?.id ?? ""),
    queryFn: () => listNotes(space!.id),
    enabled: Boolean(space),
  });

  const destroyedItems: TypeDestroyedItem[] = [
    {
      key: "notes",
      count: notes.length,
      icon: IconNote,
      label: t("{count} notes", notes.length),
    },
    // Future features: encyclopedia entries, tasks, etc.
  ].filter((item) => item.count > 0);

  const nameMatches =
    space != null && confirmationName.trim() === space.name;

  const resetState = () => {
    setConfirmationName("");
    setError(null);
    setIsDeleting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isDeleting) return;
    if (!open) {
      setSpace(null);
      resetState();
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!space) return;

    setError(null);

    if (confirmationName.trim() !== space.name) {
      setError(t("Type the space name exactly to confirm."));
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSpace(space.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.spaces.list }),
        refresh(),
      ]);
      setSpace(null);
      resetState();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t("Could not delete the space."));
      } else {
        setError(t("Could not delete the space."));
      }
      setIsDeleting(false);
    }
  };

  if (!space) return null;

  return (
    <OykModal
      open={Boolean(space)}
      onOpenChange={handleOpenChange}
      title={t("Delete {space}", undefined, { space: space.name })}
      color="danger"
      closable={!isDeleting}
      closeOnBackdrop={!isDeleting}
      content={
        <OykForm id={formId} loading={isDeleting} onSubmit={handleSubmit}>
          <p>
            {t("This will permanently delete this space and destroy all of its content")}
          </p>
          {!isNotesPending && destroyedItems.length > 0 && (
            <OykList>
              {destroyedItems.map((item) => (
                <OykList.Item
                  key={item.key}
                  content={item.label}
                  start={item.icon}
                  color="danger"
                />
              ))}
            </OykList>
          )}
          <OykForm.Alert
            error={error ?? undefined}
            errorTitle={t("Could not delete space")}
          />
          <OykForm.Field
            name="confirmationName"
            label={t("Type the space name to confirm")}
            placeholder={space.name}
            required
            value={confirmationName}
            onChange={(value) => setConfirmationName(value as string)}
          />
        </OykForm>
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
            type="submit"
            form={formId}
            label={t("Delete")}
            color="danger"
            disabled={isDeleting || !nameMatches}
          />
        </>
      )}
    />
  );
}
