import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykFeedback,
  OykForm,
  OykFormMessage,
  OykModal,
} from "@/components/ui";

export default function ModalTaskDelete({ isOpen, onClose, task }) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post(`/planner/tasks/${task.id}/delete/`);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred while deleting the task"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Delete Task")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFeedback
          variant="danger"
          icon={Trash2}
          title={t("Are you sure you want to delete this task?")}
          message={t("This action cannot be undone.")}
        />
        <OykFormMessage hasError={hasError} />
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