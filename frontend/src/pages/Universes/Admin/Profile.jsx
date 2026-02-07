import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykForm, OykFormField, OykFormHelp, OykFormMessage, OykHeading } from "@/components/ui";

export default function UniverseAdminProfile() {
  const { currentUniverse, setUniverse, getUniverses } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialProfileForm, setInitialProfileForm] = useState({
    name: currentUniverse.name || "",
    slug: currentUniverse.slug || "",
    abbr: currentUniverse.abbr || "",
    visibility: `${currentUniverse.visibility}` || "1",
  });
  const [profileForm, setProfileForm] = useState(initialProfileForm);

  const handleSubmit = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(profileForm)) {
        formData.append(key, value);
      };
      const r = await api.post(`/world/universes/${currentUniverse.slug}/edit/`, formData);
      if (!r?.ok) throw new Error(r || t("An error occurred"));
      setUniverse(r.universe);
      getUniverses();
      setProfileForm((prev) => ({
        ...prev,
        name: r.universe.name,
        slug: r.universe.slug,
        abbr: r.universe.abbr,
        visibility: `${r.universe.visibility}`,
      }));
    } catch (e) {
      if (e?.message && e.message.includes("uniq_name")) {
        setHasError(() => ({
          name: t("This name is already in use"),
        }));
      } else {
        setHasError(() => ({
          message: e.message || t("An error occurred"),
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
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

  const handleReset = async (e) => {
    setProfileForm(initialProfileForm);
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Profile")}`);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <OykHeading subtitle tag="h2" title={t("Universe Profile")} nop />
      <OykCard>
        <OykForm className="oyk-universes-admin-form" isLoading={isLoading} onSubmit={handleSubmit}>
          <OykFormField
            label={t("Name")}
            name="name"
            defaultValue={profileForm.name}
            onChange={handleChange}
            hasError={hasError?.name}
            required
          />
          <OykFormField
            label={t("Slug")}
            name="slug"
            defaultValue={profileForm.slug}
            onChange={handleChange}
            hasError={hasError?.slug}
            disabled
          />
          <OykFormField
            label={t("Abbreviation")}
            name="abbr"
            defaultValue={profileForm.abbr}
            onChange={handleChange}
            hasError={hasError?.abbr}
            disabled
          />
          <OykFormField
            label={t("Visibility")}
            name="visibility"
            type="radio"
            options={[
              { label: t("Private (OWNER)"), value: "1" },
              { label: t("Restricted (ADMINS)"), value: "2" },
              { label: t("Restricted (MODOS)"), value: "3" },
              { label: t("Public"), value: "4" },
            ]}
            defaultValue={profileForm.visibility}
            onChange={handleChange}
            hasError={hasError?.visibility}
          />
          {profileForm.visibility === "1" ? (
            <OykFormHelp helptext={t("Only the owner can see the universe")} />
          ) : profileForm.visibility === "2" ? (
            <OykFormHelp helptext={t("The owner and administrators can see the universe")} />
          ) : profileForm.visibility === "3" ? (
            <OykFormHelp helptext={t("The owner, administrators, and moderators can see the universe")} />
          ) : profileForm.visibility === "4" && (
            <OykFormHelp helptext={t("Anyone can see the universe")} />
          )}
          {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
          <div className="oyk-form-actions">
            <OykButton type="submit" color="primary" disabled={isLoading} isLoading={isLoading}>
              {t("Save")}
            </OykButton>
            <OykButton type="reset" disabled={isLoading} outline onClick={handleReset}>
              {t("Cancel")}
            </OykButton>
          </div>
        </OykForm>
      </OykCard>
    </section>
  );
}
