import { useEffect, useRef, useState } from "react";

import { api } from "@/services/api";
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

export default function OykSettingsProfileSocials() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccessSubmit, setHasSuccessSubmit] = useState(null);
  const [initialProfileForm, setInitialProfileForm] = useState({});
  const [profileForm, setProfileForm] = useState(initialProfileForm);

  const formRef = useRef(null);

  const SOCIALS = [
    { key: "artstation", label: "ArtStation" },
    { key: "bluesky", label: "Bluesky" },
    { key: "carrd", label: "Carrd" },
    { key: "deviantart", label: "DeviantArt" },
    { key: "facebook", label: "Facebook" },
    { key: "github", label: "GitHub" },
    { key: "instagram", label: "Instagram" },
    { key: "kofi", label: "Ko-fi" },
    { key: "linktree", label: "LinkTree" },
    { key: "mastodon", label: "Mastodon" },
    { key: "patreon", label: "Patreon" },
    { key: "pinterest", label: "Pinterest" },
    { key: "reddit", label: "Reddit" },
    { key: "soundcloud", label: "SoundCloud" },
    { key: "spotify", label: "Spotify" },
    { key: "steam", label: "Steam" },
    { key: "tiktok", label: "TikTok" },
    { key: "twitch", label: "Twitch" },
    { key: "youtube", label: "YouTube" },
    { key: "x", label: "X" },
  ];

  const fetchProfileData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/auth/me/profile/socials/", signal ? { signal } : {});
      if (!r.ok || !r.profile) throw r;
      setInitialProfileForm(r.profile);
      setProfileForm(r.profile);
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
      formData.append("meta_socials", JSON.stringify(profileForm.meta_socials || {}));
      const r = await api.post("/auth/me/edit/", formData);
      if (!r?.ok || !r?.user) throw r;
      setHasSuccessSubmit({
        title: t("Social media updated"),
        message: t("Your social media have been updated successfully"),
      });
    } catch (e) {
      if (e?.fields) {
        setHasError(() => ({
          fields: e.fields,
        }));
        return;
      }
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
      meta_socials: {
        ...prev.meta_socials,
        [name]: value
      }
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
      <OykHeading subtitle tag="h2" title={t("Social Media")} nop />
      {hasError?.form ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access profile data, check your internet connection or try again later")}
            variant="danger"
          />
        </OykCard>
      ) : (
        <OykCard>
          {isLoading ? (
            <OykLoading />
          ) : (
            <OykForm ref={formRef} className="oyk-settings-form" isLoading={isLoading} onSubmit={postSubmit}>
              {SOCIALS.map((social) => (
                <OykFormField
                  key={social.key}
                  label={social.label}
                  name={social.key}
                  defaultValue={profileForm.meta_socials?.[social.key]}
                  onChange={handleChange}
                  hasError={hasError?.fields?.[social.key]}
                />
              ))}
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
