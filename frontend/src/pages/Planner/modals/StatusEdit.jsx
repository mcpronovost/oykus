import { useState } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalStatusEdit({ isOpen, onClose, status }) {
  const { currentUniverse } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [statusForm, setStatusForm] = useState({
    title: status.title,
    color: status.color,
    position: status.position,
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const url =
        !currentUniverse || currentUniverse.is_default
          ? `/planner/statuses/${status.id}/edit/`
          : `/planner/u/${currentUniverse.slug}/statuses/${status.id}/edit/`;
      const formData = new FormData();
      for (const [key, value] of Object.entries(statusForm)) {
        formData.append(key, value);
      };
      const r = await api.post(url, formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setStatusForm({ ...statusForm, [e.target.name]: e.target.value });
  };

  return (
    <OykModal title={t("Edit Status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Title")}
          name="title"
          defaultValue={statusForm.title}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Colour")}
          name="color"
          type="color"
          defaultValue={statusForm.color}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Position")}
          name="position"
          type="number"
          defaultValue={statusForm.position}
          onChange={handleChange}
        />
        <OykFormMessage hasError={hasError} />
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary">
            {t("Save")}
          </OykButton>
          <OykButton type="button" onClick={onClose} outline>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}