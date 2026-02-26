import { useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalStatusEdit({ isOpen, onClose, status }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [statusForm, setStatusForm] = useState({
    title: status.title,
    color: status.color,
    position: status.position,
    is_completed: status.is_completed,
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const url = `/planner/u/${currentUniverse.slug}/statuses/${status.id}/edit/`;
      const formData = new FormData();
      for (const [key, value] of Object.entries(statusForm)) {
        formData.append(key, value);
      }
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
    const { name, value, checked } = e.target;
    setStatusForm((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error when user starts typing
    if (hasError?.fields?.[name]) {
      setHasError((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [name]: "",
        },
      }));
    }
  };

  return (
    <OykModal title={t("Edit Status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField label={t("Title")} name="title" defaultValue={statusForm.title} onChange={handleChange} />
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
        <OykFormField
          label={t("Completed")}
          name="is_completed"
          type="checkbox"
          defaultValue={statusForm.is_completed}
          onChange={handleChange}
          helptext={statusForm.is_completed ? t("Tasks will be considered as completed") : null}
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
