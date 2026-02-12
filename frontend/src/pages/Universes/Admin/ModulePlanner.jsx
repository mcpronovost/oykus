import { useEffect, useRef, useState } from "react";
import { SquircleDashed, Image } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function UniverseAdminModulePlanner() {
  const { currentUniverse, getUniverses } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialPlannerForm, setInitialPlannerForm] = useState({});
  const [plannerForm, setPlannerForm] = useState(initialPlannerForm);

  const fetchModuleData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/modules/planner/`, signal ? { signal } : {});
      if (!r.ok || !r.module || !r.module.planner) throw Error();
      setInitialPlannerForm((prev) => ({
        ...prev,
        ...r.module.planner.settings
      }));
      setPlannerForm((prev) => ({
        ...prev,
        ...r.module.planner.settings
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

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      let settings = {};
      for (const [key, value] of Object.entries(plannerForm)) {
        settings[key] = value;
      };
      formData.append("settings", JSON.stringify(settings));
      const r = await api.post(`/world/universes/${currentUniverse.slug}/modules/planner/edit/`, formData);
      if (!r?.ok) throw new Error(r || t("An error occurred"));
      getUniverses();
    } catch (e) {
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setPlannerForm((prev) => ({
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
    setPlannerForm(initialPlannerForm);
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Universe Planner Module")}`);

    fetchModuleData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <OykHeading subtitle tag="h2" title={t("Planner Module")} nop />
      <OykCard>
        {isLoading ? (
          <OykLoading />
        ) : (
          <OykForm className="oyk-universes-admin-form" isLoading={isLoading} onSubmit={handleSubmit}>
            <section>
              <OykFormField
                label={t("Display Name")}
                name="display_name"
                defaultValue={plannerForm.display_name}
                onChange={handleChange}
                hasError={hasError?.display_name}
              />
            </section>
            {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
            <div className="oyk-form-actions">
              <OykButton type="submit" color="primary" disabled={isLoading || isLoadingSubmit} isLoading={isLoadingSubmit}>
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
