import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykGeoTree from "./GeoTree";

export default function OykUniverseAdminGeography() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, getUniverses } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initGeo, setInitGeo] = useState([]);
  const [geo, setGeo] = useState([]);

  const fetchGeoData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/geo/list/`, signal ? { signal } : {});
      if (!r.ok || !r.geo) throw r;
      setGeo(r.geo);
      setInitGeo(r.geo);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(t(e?.error) || t("An error occurred"));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const postSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("items", JSON.stringify(geo));
      const r = await api.post(`/world/universes/${currentUniverse.slug}/geo/list/edit/`, formData);
      if (!r?.ok) throw r;
      setInitGeo(geo);
    } catch (e) {
      setHasError(t(e?.error) || t("An error occurred"));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Geography")}`);

    fetchGeoData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin">
      <OykHeading
        subtitle
        tag="h2"
        title={t("Geography")}
        description={t("Organize world structure and manage locations")}
        nop
        actions={
          !hasError && !isLoading && initGeo !== geo ? (
            <>
              <OykButton color="primary" isLoading={isLoadingSubmit} disabled={isLoadingSubmit} onClick={postSubmit}>
                {t("Save")}
              </OykButton>
            </>
          ) : null
        }
      />
      {hasError ? (
        <OykFeedback title={hasError || t("An error occurred")} variant="danger" ghost />
      ) : isLoading ? (
        <OykLoading />
      ) : (
        <section className="oyk-universe-admin-geography" style={isLoadingSubmit ? { pointerEvents: "none", opacity: 0.5 } : {}}>
          {geo.length > 0 ? <OykGeoTree items={geo} setItems={setGeo} /> : (
            <OykFeedback title={t("The world is empty")} message={t("Start by creating your first geographic zone")} icon={Frown} ghost>
              <OykButton color="primary" onClick={() => {}}>
                {t("Create a new zone")}
              </OykButton>
            </OykFeedback>
          )}
        </section>
      )}
    </section>
  );
}
