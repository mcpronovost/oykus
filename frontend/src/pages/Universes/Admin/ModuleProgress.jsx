import { useEffect, useState, useRef } from "react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykCard, OykForm, OykFormField, OykFormMessage, OykHeading, OykLoading } from "@/components/ui";

export default function OykUniverseAdminModuleProgress() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, changeUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccessSubmit, setHasSuccessSubmit] = useState(null);
  const [progressForm, setProgressForm] = useState({});

  const progressFormRef = useRef(null);

  const fetchModuleData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/modules/progress/`, signal ? { signal } : {});
      if (!r.ok || !r.module) throw r;
      setProgressForm((prev) => ({
        ...prev,
        ...r.module.settings,
      }));
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        message: e.message || t("An error occurred"),
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
      let settings = {};
      for (const [key, value] of Object.entries(progressForm)) {
        settings[key] = value.trim();
      }
      formData.append("settings", JSON.stringify(settings));
      const r = await api.post(`/world/universes/${currentUniverse.slug}/modules/progress/edit/`, formData);
      if (!r?.ok || !r.module) throw r;
      changeUniverse(params?.universeSlug);
      setProgressForm((prev) => ({
        ...prev,
        ...r.module.settings,
      }));
      setHasSuccessSubmit({
        title: t("Module updated"),
        message: t("The module has been updated successfully"),
      });
    } catch (e) {
      setHasError(() => ({
        message: t(e?.error) || t(e?.message) || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setProgressForm((prev) => ({
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

  const handleReset = async () => {
    setHasError(null);
    setHasSuccessSubmit(null);
    progressFormRef.current?.reset();
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Universe Progress Module")}`);

    fetchModuleData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <OykHeading subtitle tag="h2" title={t("Progress Module")} nop />
      <OykCard>
        {isLoading ? (
          <OykLoading />
        ) : (
          <OykForm
            ref={progressFormRef}
            className="oyk-universes-admin-form"
            isLoading={isLoading}
            onSubmit={postSubmit}
          >
            <section>
              <OykFormField
                label={t("Display Name")}
                name="display_name"
                defaultValue={progressForm.display_name || t("Progress")}
                onChange={handleChange}
                hasError={hasError?.display_name}
              />
            </section>
            {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
            {hasSuccessSubmit?.message && (
              <OykFormMessage successTitle={hasSuccessSubmit?.title} hasSuccess={hasSuccessSubmit?.message} />
            )}
            <div className="oyk-form-actions">
              <OykButton
                type="submit"
                color="primary"
                disabled={isLoading || isLoadingSubmit}
                isLoading={isLoadingSubmit}
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
    </section>
  );
}
