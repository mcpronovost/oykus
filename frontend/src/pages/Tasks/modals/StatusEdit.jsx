import { useState } from "react";

import { api } from "@/services/api";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/common";

export default function ModalStatusEdit({ isOpen, onClose, status }) {
  const { currentWorld } = useStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formData, setFormData] = useState({
    status: status.id,
    title: status.title,
    color: status.color,
    position: status.position,
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post("/tasks/status/edit/", formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <OykModal title={t("Edit Status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Title")}
          name="title"
          defaultValue={formData.title}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Colour")}
          name="color"
          type="color"
          defaultValue={formData.color}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Position")}
          name="position"
          type="number"
          defaultValue={formData.position}
          onChange={handleChange}
        />
        <OykFormMessage hasError={hasError} />
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary">
            {t("Save")}
          </OykButton>
          <OykButton type="button" action={onClose} outline>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}