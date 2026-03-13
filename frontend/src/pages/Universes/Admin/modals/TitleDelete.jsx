import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykFeedback, OykForm, OykFormMessage, OykModal } from "@/components/ui";

export default function OykModalTitleDelete({ titleId, isOpen, onClose }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const postSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post(`/reward/u/${currentUniverse.slug}/titles/${titleId}/delete/`);
      if (!r.ok) throw r;
      onClose(true);
    } catch (e) {
      setHasError(t(e?.error) || t("An error occurred while deleting the post"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Delete Title")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={postSubmit} isLoading={isLoading}>
        <OykFeedback
          variant="danger"
          icon={Trash2}
          title={t("Are you sure you want to delete this title?")}
          message={t("This action cannot be undone.")}
        >
          <p>{t("It will be removed for anyone who obtained it")}</p>
        </OykFeedback>
        {hasError && <OykFormMessage errorTitle={t("An error occurred")} hasError={hasError} />}
        <div className="oyk-form-actions">
          <div className="oyk-form-actions-group">
            <OykButton type="submit" color="danger">
              {t("Delete")}
            </OykButton>
            <OykButton type="button" onClick={onClose} outline>
              {t("Cancel")}
            </OykButton>
          </div>
        </div>
      </OykForm>
    </OykModal>
  );
}
