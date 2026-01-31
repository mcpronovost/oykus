import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalStatusCreate({ isOpen, onClose }) {
  const { currentUniverse } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post("/planner/status/create/", formData);
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
      title: "",
      color: "",
      position: 1,
      universe: currentUniverse?.slug || null,
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField label={t("Title")} name="title" defaultValue={formData.title} onChange={handleChange} required />
        <OykFormField
          label={t("Color")}
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
          <OykButton outline onClick={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
