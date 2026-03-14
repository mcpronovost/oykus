import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function OykModalTitleCreate({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [titleForm, setTitleForm] = useState({});

  const postSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setHasError(null);
    try {
      const url = `/progress/u/${currentUniverse.slug}/titles/create/`;
      const formData = new FormData();
      for (const [key, value] of Object.entries(titleForm)) {
        formData.append(key, value);
      }
      const r = await api.post(url, formData);
      if (!r.ok) throw r;
      onClose(true);
    } catch (e) {
      setHasError({
        message: t(e?.error) || t("An error occurred")
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setTitleForm((prev) => ({
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
    setTitleForm({
      name: "",
      description: "",
      how_to_obtain: "",
      target: "character",
      is_unique: false,
      is_hidden: false,
    });
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new title")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={postSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Name")}
          name="name"
          type="text"
          defaultValue={titleForm.name}
          onChange={handleChange}
          required
        />
        <OykFormField
          label={t("Description")}
          name="description"
          type="textarea"
          defaultValue={titleForm.description}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Obtaining")}
          name="how_to_obtain"
          type="select"
          defaultValue={titleForm.how_to_obtain}
          options={[
            { label: t("Manual"), value: "manual" },
            { label: t("On first login"), value: "first_login" },
            { label: t("On first universe creation"), value: "first_universe_creation" },
            { label: t("On first character creation"), value: "first_character_creation" },
            { label: t("On first blog post"), value: "first_blog_post" },
            { label: t("On first blog comment"), value: "first_blog_comment" },
            { label: t("On first blog reaction"), value: "first_blog_reaction" }
          ]}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Target")}
          name="target"
          type="select"
          defaultValue={titleForm.target}
          options={[
            ...(currentUniverse.is_default ? [{ label: t("User"), value: "user" }] : []),
            { label: t("Character"), value: "character" },
            ...(currentUniverse.is_default ? [{ label: t("Universe"), value: "universe" }] : []),
          ]}
          onChange={handleChange}
          disabled={!currentUniverse.is_default}
        />
        <OykFormField
          label={t("Unique")}
          name="is_unique"
          type="checkbox"
          defaultValue={titleForm.is_unique}
          onChange={handleChange}
          helptext={titleForm.is_unique ? t("Will only be obtainable by a single user") : null}
        />
        <OykFormField
          label={t("Hidden")}
          name="is_hidden"
          type="checkbox"
          defaultValue={titleForm.is_hidden}
          onChange={handleChange}
          helptext={titleForm.is_hidden ? t("Will not appear in rewards page until it is obtained") : null}
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
