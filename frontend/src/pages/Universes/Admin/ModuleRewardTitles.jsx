import { useEffect, useState } from "react";
import { Frown, Key, Plus, X } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykModalTitleCreate from "./modals/TitleCreate";

export default function OykUniverseAdminModuleRewardTitles() {
  const { routeTitle, params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccessSubmit, setHasSuccessSubmit] = useState(null);
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

  const postSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    setHasSuccessSubmit(null);
    try {
      const formData = new FormData();
      let settings = {};
      for (const [key, value] of Object.entries(rewardForm)) {
        settings[key] = value.trim();
      }
      formData.append("settings", JSON.stringify(settings));
      const r = await api.post(`/world/universes/${currentUniverse.slug}/modules/reward/edit/`, formData);
      if (!r?.ok || !r.module) throw r;
      changeUniverse(params?.universeSlug);
      setRewardForm((prev) => ({
        ...prev,
        ...r.module.settings,
      }));
      setHasSuccessSubmit({
        title: t("Settings updated"),
        message: t("Settings of the reward module have been updated successfully"),
      });
    } catch (e) {
      setHasError(() => ({
        message: e.error || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleCloseModalTitleCreate = (updated) => {
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
      <OykModalTitleCreate isOpen={isModalTitleCreateOpen} onClose={handleCloseModalTitleCreate} />
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
            <li key={title.id} className="oyk-universes-admin-module-reward-titles-list-item">
              <OykCard>
                <header className="oyk-universes-admin-module-reward-titles-list-item-info">
                  <h3>{title.name}</h3>
                  <p>{title.description}</p>
                  <small>
                    <Key size={14} /> {title.how_to_obtain}
                  </small>
                </header>
                <div className="oyk-universes-admin-module-reward-titles-list-item-actions">
                  <OykButton outline onClick={() => {}}>
                    {t("Edit")}
                  </OykButton>
                  <OykButton outline color="danger" icon={X} onClick={() => {}} />
                </div>
              </OykCard>
            </li>
          ))}
        </ul>
      ) : (
        <OykFeedback title={t("No titles found")} icon={Frown} ghost />
      )}
    </section>
  );
}
