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
    name: status.name,
    colour: status.colour,
    sort_order: status.sort_order,
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const data = await api.updateTasksStatus(currentWorld.slug, status.id, formData);
      if (!data.success) {
        throw new Error(
          data.message || data.error || t("Failed to edit status")
        );
      }
      onClose(true);
    } catch (error) {
      if ([401, 403].includes(error?.status)) {
        setHasError({
          message: t("You are not allowed to edit this status"),
        });
      } else {
        setHasError({
          message: t("An error occurred while editing the status"),
        });
      }
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
          label={t("Name")}
          name="name"
          defaultValue={formData.name}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Colour")}
          name="colour"
          type="color"
          defaultValue={formData.colour}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Sort Order")}
          name="sort_order"
          type="number"
          defaultValue={formData.sort_order}
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