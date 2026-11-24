import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OykAlert, OykButton, OykModal } from "@/components/ui";
import {
  ApiError,
  queryKeys,
  setSpaceActive,
  type TypeSpace,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";

export default function OykSettingsModalsSpaceDeactivate({
  space,
  setSpace,
}: {
  space: TypeSpace | null;
  setSpace: (space: TypeSpace | null) => void;
}) {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDeactivating = space?.isActive !== false;

  const resetState = () => {
    setError(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isSubmitting) return;
    if (!open) {
      setSpace(null);
      resetState();
    }
  };

  const handleConfirm = async (close: () => void) => {
    if (!space) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await setSpaceActive(space.id, !isDeactivating);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.spaces.list }),
        queryClient.invalidateQueries({ queryKey: queryKeys.spaces.logs(space.id) }),
        refresh(),
      ]);
      setSpace(null);
      resetState();
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.message
            || (isDeactivating
              ? t("Could not deactivate the space.")
              : t("Could not reactivate the space.")),
        );
      } else {
        setError(
          isDeactivating
            ? t("Could not deactivate the space.")
            : t("Could not reactivate the space."),
        );
      }
      setIsSubmitting(false);
    }
  };

  if (!space) return null;

  return (
    <OykModal
      open={Boolean(space)}
      onOpenChange={handleOpenChange}
      title={
        isDeactivating
          ? t("Deactivate {space}", undefined, { space: space.name })
          : t("Reactivate {space}", undefined, { space: space.name })
      }
      color={isDeactivating ? "danger" : "accent"}
      size="sm"
      closable={!isSubmitting}
      closeOnBackdrop={!isSubmitting}
      content={
        <>
          <p>
            {isDeactivating
              ? t("settings.dangerzone.deactivate.confirm")
              : t("settings.dangerzone.reactivate.confirm")}
          </p>
          {isDeactivating ? (
            <OykAlert
              title={t("settings.dangerzone.deactivatespacenote")}
              color="warning"
              variant="ghost"
            />
          ) : null}
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
            disabled={isSubmitting}
            onClick={close}
          />
          <OykButton
            label={
              isDeactivating
                ? t("settings.dangerzone.deactivatespace")
                : t("settings.dangerzone.reactivatespace")
            }
            color={isDeactivating ? "danger" : "accent"}
            disabled={isSubmitting}
            onClick={() => {
              void handleConfirm(close);
            }}
          />
        </>
      )}
    />
  );
}
