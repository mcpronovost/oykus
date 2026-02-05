import { useEffect, useState } from "react";
import { CircleFadingArrowUp, Frown, GalleryHorizontalEnd, ListTodo, Mail, MessagesSquare, ScrollText, Star, Swords } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykModulesCard from "./ModulesCard";

export default function UniverseAdminModules() {
  const { setCurrentUniverse } = useAuth();
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();

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
      const r = await api.get(`/game/universes/${params?.universeSlug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();
      setModules([
        {
          field: "is_mod_planner_active",
          name: t("Planner"),
          description: t("Plan and track tasks, assign people, and more"),
          icon: ListTodo,
          active: r.universe.is_mod_planner_active || 0,
        },
        {
          field: "is_mod_blog_active",
          name: t("Blog"),
          description: t("Sharing content, insights, and updates"),
          icon: ScrollText,
          active: r.universe.is_mod_blog_active || 0,
          disabled: true,
        },
        {
          field: "is_mod_forum_active",
          name: t("Forum"),
          description: t("Discuss and interact with other members"),
          icon: MessagesSquare,
          active: r.universe.is_mod_forum_active || 0,
          disabled: true,
        },
        {
          field: "is_mod_courrier_active",
          name: t("Courrier"),
          description: t("Send and receive private messages"),
          icon: Mail,
          active: r.universe.is_mod_courrier_active || 0,
          disabled: true,
        },
        {
          field: "is_mod_collectibles_active",
          name: t("Collectibles"),
          description: t("Collect and manage items and rewards"),
          icon: GalleryHorizontalEnd,
          active: r.universe.is_mod_collectibles_active || 0,
          disabled: true,
        },
        {
          field: "is_mod_achievements_active",
          name: t("Achievements"),
          description: t("Unlock achievements based on activity and interactions"),
          icon: Star,
          active: r.universe.is_mod_achievements_active || 0,
        },
        {
          field: "is_mod_game_active",
          name: t("Game"),
          description: t("Game mechanics specific to this universe"),
          icon: Swords,
          active: r.universe.is_mod_game_active || 0,
          disabled: true,
        },
        {
          field: "is_mod_leveling_active",
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

  const handleModuleUsage = async (module, action) => {
    setIsLoadingUsage(module);
    setHasErrorUsage(null);
    try {
      const formData = new FormData();
      formData.append("module", module);
      formData.append("action", action);
      const r = await api.post(`/game/universes/${params?.universeSlug}/modules/edit/`, formData);
      if (!r.ok || !r.module) throw Error();
      setCurrentUniverse();
      setModules((prev) => {
        const index = prev.findIndex((m) => m.field === module);
        if (index !== -1) {
          prev[index].active = r.module[module];
        }
        return [...prev];
      });
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
          {modules?.length > 0 ? (
            <ul className="oyk-universes-admin-modules-list">
              {modules.map((m) => (
                <OykModulesCard key={m.field} module={m} onActivate={() => handleModuleUsage(m.field, "activate")} onDeactivate={() => handleModuleUsage(m.field, "deactivate")} isLoading={isLoadingUsage === m.field} hasError={hasErrorUsage?.[m.field] || null} />
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
