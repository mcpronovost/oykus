import { useEffect, useRef, useState } from "react";

import { oykDate } from "@/utils";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function SettingsProfileInformations() {
  const { currentUser } = useAuth();
  const { routeTitle } = useRouter();
  const { t, lang } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccessSubmit, setHasSuccessSubmit] = useState(null);
  const [initialProfileForm, setInitialProfileForm] = useState({});
  const [profileForm, setProfileForm] = useState(initialProfileForm);

  const formRef = useRef(null);

  const fetchProfileData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/auth/me/profile/", signal ? { signal } : {});
      if (!r.ok || !r.profile) throw r;
      const payload = {
        meta_bio: r.profile.meta_bio,
        meta_birthday: r.profile.meta_birthday,
        meta_country: r.profile.meta_country,
        meta_job: r.profile.meta_job,
        meta_mood: r.profile.meta_mood,
        meta_website: r.profile.meta_website,
        created_at: oykDate(r.profile.created_at, "full", lang, currentUser?.timezone),
      };
      setInitialProfileForm(payload);
      setProfileForm(payload);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        form: t(e?.error) || t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const postSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    setHasSuccessSubmit(null);
    try {
      const formData = new FormData();
      formData.append("meta_bio", profileForm.meta_bio ?? "");
      formData.append("meta_country", profileForm.meta_country ?? "");
      formData.append("meta_job", profileForm.meta_job ?? "");
      formData.append("meta_mood", profileForm.meta_mood ?? "");
      formData.append("meta_website", profileForm.meta_website ?? "");
      if (profileForm.meta_birthday) {
        const d = new Date(profileForm.meta_birthday);
        const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
        formData.append("meta_birthday", iso);
      } else {
        formData.append("meta_birthday", "");
      }
      const r = await api.post("/auth/me/edit/", formData);
      if (!r?.ok || !r?.user) throw r;
      formRef?.current?.reset();
      setInitialProfileForm((prev) => ({
        ...prev,
        ...r.user,
      }));
      setProfileForm((prev) => ({
        ...prev,
        ...r.user,
      }));
      setHasSuccessSubmit({
        title: t("Profile updated"),
        message: t("Your profile has been updated successfully"),
      });
    } catch (e) {
      setHasError(() => ({
        message: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
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

  const handleReset = async () => {
    formRef?.current?.reset();
    setProfileForm(initialProfileForm);
    setHasError(null);
    setHasSuccessSubmit(null);
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Profile")}`);

    fetchProfileData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-profile">
      <OykHeading subtitle tag="h2" title={t("Optional Information")} nop />
      {hasError?.form ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access account data, check your internet connection or try again later")}
            variant="danger"
          />
        </OykCard>
      ) : (
        <OykCard>
          {isLoading ? (
            <OykLoading />
          ) : (
            <OykForm ref={formRef} className="oyk-settings-form" isLoading={isLoading} onSubmit={postSubmit}>
              <OykFormField
                label={t("About")}
                name="meta_bio"
                type="textarea"
                defaultValue={profileForm.meta_bio}
                onChange={handleChange}
                hasError={hasError?.meta_bio}
              />
              <OykFormField
                label={t("Birthday")}
                name="meta_birthday"
                type="date"
                defaultValue={profileForm.meta_birthday}
                onChange={handleChange}
                hasError={hasError?.meta_birthday}
              />
              <OykFormField
                label={t("Country")}
                name="meta_country"
                defaultValue={profileForm.meta_country}
                onChange={handleChange}
                hasError={hasError?.meta_country}
              />
              <OykFormField
                label={t("Occupation")}
                name="meta_job"
                defaultValue={profileForm.meta_job}
                onChange={handleChange}
                hasError={hasError?.meta_job}
              />
              <OykFormField
                label={t("Mood")}
                name="meta_mood"
                defaultValue={profileForm.meta_mood}
                onChange={handleChange}
                hasError={hasError?.meta_mood}
              />
              <hr />
              <OykFormField
                label={t("Website")}
                name="meta_website"
                defaultValue={profileForm.meta_website}
                onChange={handleChange}
                hasError={hasError?.meta_website}
              />
              {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
              {hasSuccessSubmit?.message && (
                <OykFormMessage successTitle={hasSuccessSubmit?.title} hasSuccess={hasSuccessSubmit?.message} />
              )}
              <div className="oyk-form-actions">
                <OykButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || isLoadingSubmit}
                  isLoading={isLoading || isLoadingSubmit}
                >
                  {t("Save")}
                </OykButton>
                <OykButton type="reset" disabled={isLoading || isLoadingSubmit} outline onClick={handleReset}>
                  {t("Cancel")}
                </OykButton>
              </div>
            </OykForm>
          )}
        </OykCard>
      )}
    </section>
  );
}
