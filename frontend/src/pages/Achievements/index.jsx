import "@/assets/styles/page/_achievements.scss";
import { useEffect, useState } from "react";
import { Construction } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykCard,
  OykChip,
  OykGrid,
  OykGridRow,
  OykGridNav,
  OykGridMain,
  OykHeading,
  OykLink,
  OykLoading,
} from "@/components/ui";

export default function Achievements() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/achievements/", signal ? { signal } : {});
      if (!r?.ok) throw new Error(r.error || t("An error occurred"));
      setAchievements(r.achievements);
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
              (menu)
            </OykGridNav>
            <OykGridMain>
              <section style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                {achievements
                  ? achievements.map((a) => (
                      <OykCard nop fh style={{ flex: "0 0 25%" }}>
                        <OykChip>{a.type}</OykChip>
                        {a.title} - {a.description} - {a.is_unlocked ? "true" : "false"} - {a.progress} - {a.goal} -{" "}
                        {a.period}
                      </OykCard>
                    ))
                  : null}
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
