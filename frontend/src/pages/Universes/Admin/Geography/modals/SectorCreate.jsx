import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function OykModalSectorCreate({ isOpen, onClose, zoneId, position }) {
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
      const r = await api.post(`/world/universes/${currentUniverse.slug}/geo/sectors/create/`, formData);
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
      zone_id: zoneId,
      name: "",
      description: "",
      visibility: "6",
      position: position,
      col: "100",
      is_locked: false,
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
        <OykFormField
          label={t("Description")}
          name="description"
          type="textarea"
          defaultValue={createForm.description}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Column Width")}
          name="col"
          type="radio"
          defaultValue={createForm.col}
          options={[
            { label: "25%", value: "25" },
            { label: "33%", value: "33" },
            { label: "50%", value: "50" },
            { label: "75%", value: "75" },
            { label: "100%", value: "100" },
          ]}
          onChange={handleChange}
        />
        {/*<OykFormField
          label={t("Locked")}
          name="is_locked"
          type="checkbox"
          defaultValue={createForm.is_locked}
          onChange={handleChange}
        />*/}
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
