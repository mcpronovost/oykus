import "@/assets/styles/page/_achievements.scss";
import { useEffect, useState } from "react";
import { Blocks, Flame, Star } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykGrid,
  OykGridRow,
  OykGridNav,
  OykGridMain,
  OykHeading,
  OykLoading,
} from "@/components/ui";
import AchievementCard from "./AchievementCard";

export default function Achievements() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchAchievements = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/achievements/", signal ? { signal } : {});
      if (!r?.ok) throw new Error(r.error || t("An error occurred"));
      setAchievements(r.achievements);
      setCategories(r.categories);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchAchievements(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="oyk-page oyk-achievements">
      <OykHeading title={t("Achievements")} />
      <OykGrid>
        {hasError ? (
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access achievements data, check your internet connection or try again later")}
            variant="danger"
          />
        ) : !isLoading ? (
          <OykGridRow>
            <OykGridNav>
              <nav className="oyk-achievements-nav">
                <ul>
                  <li className="oyk-achievements-nav-item">
                    <span className="oyk-achievements-nav-item-icon">
                      <Flame size={20} color={"var(--oyk-c-primary)"} />
                    </span>
                    <span className="oyk-achievements-nav-item-title">
                      {t("Recents")}
                    </span>
                  </li>
                  {Object.entries(categories).map(([key, value]) => (
                    <li key={key} className="oyk-achievements-nav-item">
                      <span className="oyk-achievements-nav-item-icon">
                        {key == "general" ? <Star size={20} color={"var(--oyk-c-primary)"} /> : <Blocks size={20} color={"var(--oyk-c-primary)"} />}
                      </span>
                      <span className="oyk-achievements-nav-item-title">
                        {t(key)} ({value})
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>
            </OykGridNav>
            <OykGridMain>
              <section className="oyk-achievements-grid">
                {achievements.map((a) => (
                  <AchievementCard key={a.tag} achievement={a} />
                ))}
              </section>
            </OykGridMain>
          </OykGridRow>
        ) : (
          <OykLoading />
        )}
      </OykGrid>
    </section>
  );
}
