import { useEffect, useState } from "react";
import { CircleFadingArrowUp, Frown, GalleryHorizontalEnd, ListTodo, MessagesSquare, Star, Swords } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykModulesCard from "./ModulesCard";

export default function UniverseAdminModules() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [modules, setModules] = useState([]);

  const fetchModulesData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    setModules([]);
    try {
      const r = await api.get(`/game/universes/${params?.universeSlug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();
      setModules([
        {
          name: t("Planner"),
          description: t("Plan and track tasks, assign people, and more"),
          icon: ListTodo,
          active: r.universe.is_mod_planner_active || 0,
        },
        {
          name: t("Collectibles"),
          description: t("Collect and manage items and rewards"),
          icon: GalleryHorizontalEnd,
          active: r.universe.is_mod_collectibles_active || 0,
        },
        {
          name: t("Achievements"),
          description: t("Unlock achievements based on activity and interactions"),
          icon: Star,
          active: r.universe.is_mod_achievements_active || 0,
        },
        {
          name: t("Forum"),
          description: t("Discuss and interact with other members"),
          icon: MessagesSquare,
          active: r.universe.is_mod_forum_active || 0,
        },
        {
          name: t("Game"),
          description: t("Game mechanics specific to this universe"),
          icon: Swords,
          active: r.universe.is_mod_game_active || 0,
        },
        {
          name: t("Leveling"),
          description: t("Gain levels through interactions and activity"),
          icon: CircleFadingArrowUp,
          active: r.universe.is_mod_leveling_active || 0,
        },
      ]);
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
          {modules?.length > 0 ? (
            <ul className="oyk-universes-admin-modules-list">
              {modules.map((m) => (
                <OykModulesCard key={m.name} module={m} />
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
