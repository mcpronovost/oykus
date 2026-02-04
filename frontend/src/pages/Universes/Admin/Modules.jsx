import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykFriendsCard from "./FriendsCard";

export default function UniverseAdminModules() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [modules, setModules] = useState([]);

  const fetchModulesData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/universes/${params?.universeSlug}/admin/modules/`, signal ? { signal } : {});
      if (!r.ok || !r.modules) throw Error();
      setModules(r.modules);
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
    <section className="oyk-settings-friends">
      <OykHeading subtitle tag="h2" title={t("Manage Modules")} nop />
      {hasError?.fetch ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={`${t("Unable to access friends requests")}. ${t("Check your internet connection or try again later")}`}
            variant="danger"
          />
        </OykCard>
      ) : isLoading ? (
        <OykLoading />
      ) : (
        <>
          {friend?.length > 0 ? (
            <ul className="oyk-settings-friends-list">
              {friend.map((f) => (
                <OykFriendsCard key={f.slug} friend={f} fetchData={fetchFriendsData} />
              ))}
            </ul>
          ) : (
            <OykCard>
              <OykFeedback ghost title={t("No friends")} icon={Frown} />
            </OykCard>
          )}
        </>
      )}
    </section>
  );
}
