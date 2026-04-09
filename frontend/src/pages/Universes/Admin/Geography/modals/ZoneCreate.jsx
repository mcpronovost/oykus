import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function OykModalZoneCreate({ isOpen, onClose, position }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [createForm, setCreateForm] = useState({});

  const postSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(createForm)) {
        formData.append(key, value);
      }
      const r = await api.post(`/world/universes/${currentUniverse.slug}/geo/zones/create/`, formData);
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
    setCreateForm((prev) => ({
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
    setCreateForm({
      name: "",
      description: "",
      visibility: "6",
      position: position,
    });
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new sector")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={postSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Name")}
          name="name"
          type="text"
          defaultValue={createForm.name}
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
