import { useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalFriendsDelete({ friend, isOpen, onClose }) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("slug", friend.slug);
      const r = await api.post("/auth/friends/delete/", formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!friend) return null;

  return (
    <OykModal title={t("Delete a Friend")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <div className="oyk-settings-friends-modal-text">
          {t("Do you really want to remove {name} from your friend", null, { name: friend.name })}
        </div>
        {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
        <div className="oyk-form-actions">
          <OykButton type="submit" color="danger">
            {t("Delete friend")}
          </OykButton>
          <OykButton outline onClick={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
