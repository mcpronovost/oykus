import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalStatusCreate({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [statusForm, setStatusForm] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const url =
        !currentUniverse || currentUniverse.is_default
          ? "/planner/statuses/create/"
          : `/planner/u/${currentUniverse.slug}/statuses/create/`;
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

  useEffect(() => {
    setStatusForm({
      title: "",
      color: "",
      position: 1,
      universe: currentUniverse?.slug || null,
    });
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new status")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField label={t("Title")} name="title" defaultValue={statusForm.title} onChange={handleChange} required />
        <OykFormField
          label={t("Color")}
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
          <OykButton outline onClick={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
