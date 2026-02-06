import { useEffect, useRef, useState } from "react";
import { SquircleDashed, Image } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykBanner,
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function UniverseAdminThemeStylesheet() {
  const { currentUniverse, setCurrentUniverse } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const stylesheetRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialThemeForm, setInitialThemeForm] = useState({
    stylesheet: "{}",
  });
  const [themeForm, setThemeForm] = useState(initialThemeForm);

  const fetchThemeData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/game/universes/${currentUniverse.slug}/theme/`, signal ? { signal } : {});
      if (!r.ok || !r.theme) throw Error();
      setInitialThemeForm((prev) => ({
        ...prev,
        stylesheet: r.theme.stylesheet,
      }));
      setThemeForm((prev) => ({
        ...prev,
        stylesheet: r.theme.stylesheet,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setThemeForm((prev) => ({
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
    setThemeForm({
      stylesheet: initialThemeForm.stylesheet,
    });
    stylesheetRef.current.value = initialThemeForm.stylesheet;
  };

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("stylesheet", themeForm.stylesheet);
      const r = await api.post(`/game/universes/${currentUniverse.slug}/theme/edit/`, formData);
      if (!r?.ok || !r.theme) throw new Error(r || t("An error occurred"));
      setThemeForm((prev) => ({
        ...prev,
        stylesheet: r.theme.stylesheet,
      }));
      stylesheetRef.current.value = r.theme.stylesheet;
      setCurrentUniverse();
    } catch (e) {
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Stylesheet")}`);

    fetchThemeData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <OykHeading subtitle tag="h2" title={t("Stylesheet")} nop />
      <OykCard>
        {isLoading ? (
          <OykLoading />
        ) : (
          <OykForm className="oyk-universes-admin-form" isLoading={isLoading} onSubmit={handleSubmit}>
            <OykFormField
              ref={stylesheetRef}
              label={t("Stylesheet")}
              name="stylesheet"
              type="textarea"
              defaultValue={themeForm.stylesheet}
              onChange={handleChange}
              hasError={hasError?.stylesheet}
              required
              hideLabel
            />
            {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
            <div className="oyk-form-actions">
              <OykButton type="submit" color="primary" disabled={isLoading || isLoadingSubmit}>
                {isLoadingSubmit ? t("Saving...") : t("Save")}
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
