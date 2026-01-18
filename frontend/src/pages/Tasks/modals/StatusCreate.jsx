import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykModal,
} from "@/components/common";

export default function ModalStatusCreate({
  isOpen,
  onClose,
}) {
  const { currentWorld } = useStore();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post("/tasks/status/create/", formData);
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

  useEffect(() => {
    setFormData({
      name: "",
      colour: "",
      sort_order: "",
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Name")}
          name="name"
          defaultValue={formData.name}
          onChange={handleChange}
          required
        />
        <OykFormField
          label={t("Color")}
          name="colour"
          type="color"
          defaultValue={formData.colour}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Sort order")}
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
          <OykButton outline action={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}