import { useEffect, useState } from "react";
import { Frown, Key, Plus, X } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykUniverseAdminModuleRewardTitlesCard from "./ModuleRewardTitlesCard";
import OykModalTitleCreate from "./modals/TitleCreate";
import OykModalTitleDelete from "./modals/TitleDelete";

export default function OykUniverseAdminModuleRewardTitles() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [isModalTitleCreateOpen, setIsModalTitleCreateOpen] = useState(false);
  const [titles, setTitles] = useState({});

  const fetchModuleData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/reward/u/${currentUniverse.slug}/titles/`, signal ? { signal } : {});
      if (!r.ok || !r.titles) throw r;
      setTitles(r.titles);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        message: t(e?.error) || t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModalTitle = (updated) => {
    setIsModalTitleCreateOpen(false);
    if (updated) {
      fetchModuleData();
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Universe Reward Module")}`);

    fetchModuleData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-module-reward-titles">
      <OykModalTitleCreate isOpen={isModalTitleCreateOpen} onClose={handleCloseModalTitle} />
      <OykHeading subtitle tag="h2" title={t("Titles")} nop actions={(
        <>
          <OykButton color="primary" icon={Plus} onClick={() => setIsModalTitleCreateOpen(true)}>
            {t("Create a new title")}
          </OykButton>
        </>
      )} />
      {isLoading ? (
        <OykLoading />
      ) : hasError?.message ? (
        <OykFeedback title={t("An error occurred")} message={hasError?.message} variant="danger" ghost />
      ) : titles?.length > 0 ? (
        <ul className="oyk-universes-admin-module-reward-titles-list">
          {titles.map((title) => (
            <OykUniverseAdminModuleRewardTitlesCard key={title.id} title={title} onCloseModal={handleCloseModalTitle} />
          ))}
        </ul>
      ) : (
        <OykFeedback title={t("No titles found")} icon={Frown} ghost />
      )}
    </section>
  );
}
