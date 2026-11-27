import { useId, useState } from "react";
import { OykButton, OykForm, OykModal } from "@/components/ui";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

export default function OykProfileModalsAccountDelete({
  name,
  open,
  setOpen,
}: {
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { deleteAccount } = useAuth();
  const { n } = useRouter();
  const formId = useId();
  const [confirmationName, setConfirmationName] = useState("");
  const [error, setError] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);
  const nameMatches = confirmationName.trim() !== "" && confirmationName.trim() === name.trim();

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;
    if (!nextOpen) {
      setConfirmationName("");
      setError(undefined);
    }
    setOpen(nextOpen);
  };

  const handleSubmit = async () => {
    if (!open || !nameMatches || isDeleting) return;

    setError(undefined);
    setIsDeleting(true);
    try {
      await deleteAccount(confirmationName.trim());
      n("login");
    } catch {
      setError(t("Could not delete your account. Try again."));
      setIsDeleting(false);
    }
  };

  return (
    <OykModal
      open={open}
      onOpenChange={handleOpenChange}
      title={t("profile.dangerzone.deleteuserpermanently")}
      color="danger"
      closable={!isDeleting}
      closeOnBackdrop={!isDeleting}
      content={
        <OykForm id={formId} loading={isDeleting} onSubmit={handleSubmit}>
          <p>{t("profile.deleteaccount.consequences")}</p>
          <p>{t("profile.dangerzone.deleteuserpermanentlynote")}</p>
          <OykForm.Alert error={error} />
          <OykForm.Field
            name="confirmationName"
            label={t("Type your profile name to confirm")}
            placeholder={name}
            value={confirmationName}
            required
            disabled={isDeleting}
            onChange={(value) => setConfirmationName(value as string)}
          />
        </OykForm>
      }
      actions={({ close }) => (
        <>
          <OykButton label={t("Cancel")} variant="ghost" disabled={isDeleting} onClick={close} />
          <OykButton
            type="submit"
            form={formId}
            label={t("Delete")}
            color="danger"
            loading={isDeleting}
            disabled={isDeleting || !nameMatches}
          />
        </>
      )}
    />
  );
}
