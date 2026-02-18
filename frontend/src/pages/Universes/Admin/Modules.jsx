import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";
import { OykAlert, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykModulesCard from "./ModulesCard";

export default function UniverseAdminModules() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();
  const { changeUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsage, setIsLoadingUsage] = useState(null);
  const [hasError, setHasError] = useState(null);
  const [hasErrorUsage, setHasErrorUsage] = useState(null);
  const [modules, setModules] = useState([]);

  const fetchModulesData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    setModules([]);
    try {
      const r = await api.get(`/world/universes/${params?.universeSlug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();
      setModules(r.universe.modules);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        fetch: t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleModuleUsage = async (module, action) => {
    setIsLoadingUsage(module);
    setHasErrorUsage(null);
    try {
      const formData = new FormData();
      formData.append("module", module);
      formData.append("action", action);
      const r = await api.post(`/world/universes/${params?.universeSlug}/modules/edit/`, formData);
      if (!r.ok || !r.module) throw Error();
      setModules((prev) => ({
        ...prev,
        [module]: r.module,
      }));
      changeUniverse(params?.universeSlug);
    } catch (e) {
      setHasErrorUsage(() => ({
        [module]: e.message || t("An error occurred"),
      }));
    } finally {
      setIsLoadingUsage(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Manage Modules")}`);

    fetchModulesData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-modules">
      <OykHeading subtitle tag="h2" title={t("Manage Modules")} nop />
      {hasError?.fetch ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={`${t("Unable to access modules list")}. ${t("Check your internet connection or try again later")}`}
            variant="danger"
          />
        </OykCard>
      ) : isLoading ? (
        <OykLoading />
      ) : (
        <>
          {Object.values(modules)?.length > 0 ? (
            <ul className="oyk-universes-admin-modules-list">
              {Object.entries(modules).map(([key, value], index) => (
                <OykModulesCard
                  key={index}
                  module={value}
                  onActivate={() => handleModuleUsage(key, "activate")}
                  onDeactivate={() => handleModuleUsage(key, "deactivate")}
                  isLoading={isLoadingUsage === key}
                  hasError={hasErrorUsage?.[key] || null}
                />
              ))}
            </ul>
          ) : (
            <OykCard>
              <OykFeedback ghost title={t("No modules found")} icon={Frown} />
            </OykCard>
          )}
        </>
      )}
    </section>
  );
}
