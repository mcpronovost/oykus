import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function OykModalZoneEdit({ isOpen, onClose, zone }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [editForm, setEditForm] = useState({});

  const postSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(editForm)) {
        formData.append(key, value);
      }
      const r = await api.post(`/world/universes/${currentUniverse.slug}/geo/zones/${zone.id}/edit/`, formData);
      if (!r.ok) throw r;
      onClose(true);
    } catch (e) {
      setHasError({
        message: t(e?.error) || t("An error occurred"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setEditForm((prev) => ({
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

  useEffect(() => {
    setEditForm({
      name: zone.name,
      description: "",
      visibility: "6",
      position: zone.position,
    });
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Edit zone")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={postSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Name")}
          name="name"
          type="text"
          defaultValue={editForm.name}
          onChange={handleChange}
          required
        />
        {hasError?.message && <OykFormMessage hasError={hasError.message} />}
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary" disabled={isLoading} isLoading={isLoading}>
            {t("Save")}
          </OykButton>
          <OykButton outline disabled={isLoading} onClick={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
