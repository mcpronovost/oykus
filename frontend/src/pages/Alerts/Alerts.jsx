import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykButton, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykAlertsCard from "./AlertsCard";

export default function OykManageAlerts() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertsOffset, setAlertsOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const fetchAlertsData = async (signal) => {
    if (alerts.length <= 0) setIsLoading(true);
    else setIsLoadingMore(true);
    setHasError(null);
    try {
      const r = await api.get(`/courrier/alerts/${alertsOffset}/`, signal ? { signal } : {});
      if (!r?.ok || !r?.alerts) throw r;
      setAlerts((prev) => [...prev, ...r.alerts]);
      if (r.alerts.length === 5) {
        setShowLoadMore(true);
        setAlertsOffset((prev) => prev + 5);
      } else setShowLoadMore(false);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchAlertsData(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="oyk-alerts">
      <OykHeading subtitle tag="h2" title={t("Manage Alerts")} nop />
      {hasError?.message ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={`${t("Unable to access alerts")}. ${t("Check your internet connection or try again later")}`}
            variant="danger"
          />
        </OykCard>
      ) : isLoading ? (
        <OykLoading />
      ) : (
        <>
          {alerts?.length > 0 ? (
            <>
              <ul className="oyk-alerts-list">
                {alerts.map((alert, index) => (
                  <OykAlertsCard key={index} alert={alert} />
                ))}
              </ul>
              {showLoadMore ? (
                <div className="oyk-alerts-list-loadmore" style={{ textAlign: "center" }}>
                  <OykButton small color="card" isLoading={isLoadingMore} disabled={isLoadingMore} onClick={fetchAlertsData}>
                    {t("Load more")}
                  </OykButton>
                </div>
              ) : null}
            </>
          ) : (
            <OykCard>
              <OykFeedback ghost title={t("No alerts")} icon={Frown} />
            </OykCard>
          )}
        </>
      )}
    </section>
  );
}
