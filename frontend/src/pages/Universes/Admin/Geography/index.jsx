import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykGeoTree from "./GeoTree";
import OykModalZoneCreate from "./modals/ZoneCreate";

export default function OykUniverseAdminGeography() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasErrorSubmit, setHasErrorSubmit] = useState(null);
  const [universePlan, setUniversePlan] = useState("free");
  const [initGeo, setInitGeo] = useState([]);
  const [geo, setGeo] = useState([]);
  const [isModalZoneCreateOpen, setIsModalZoneCreateOpen] = useState(false);

  const fetchGeoData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    setHasErrorSubmit(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/geo/list/`, signal ? { signal } : {});
      if (!r.ok || !r.geo) throw r;
      setGeo(r.geo);
      setInitGeo(r.geo);
      setUniversePlan(r.plan);
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
    setHasErrorSubmit(null);
    try {
      const formData = new FormData();
      formData.append(
        "items",
        JSON.stringify(
          geo.map((g) => ({
            id: g.id,
            parentUid: g.parentUid,
            type: g.type,
            position: g.position,
          })),
        ),
      );
      const r = await api.post(`/world/universes/${currentUniverse.slug}/geo/list/edit/`, formData);
      if (!r?.ok) throw r;
      setInitGeo(geo);
    } catch (e) {
      setHasErrorSubmit(t(e?.error) || t("An error occurred"));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleCloseModal = (updated) => {
    setIsModalZoneCreateOpen(false);
    if (updated) {
      fetchGeoData();
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
      <OykModalZoneCreate
        isOpen={isModalZoneCreateOpen}
        onClose={handleCloseModal}
        position={0}
      />
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
      {hasErrorSubmit && <OykFeedback title={hasErrorSubmit || t("An error occurred")} variant="danger" ghost />}
      {hasError ? (
        <OykFeedback title={hasError || t("An error occurred")} variant="danger" ghost />
      ) : ((!geo || geo.length <= 0) && isLoading) ? (
        <OykLoading />
      ) : (
        <section
          className="oyk-universe-admin-geography"
          style={isLoading || isLoadingSubmit ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          {geo.length > 0 ? (
            <OykGeoTree items={geo} setItems={setGeo} updateItems={fetchGeoData} universePlan={universePlan} />
          ) : (
            <OykFeedback
              title={t("The world is empty")}
              message={t("Start by creating your first geographic zone")}
              icon={Frown}
              ghost
            >
              <OykButton color="primary" onClick={() => setIsModalZoneCreateOpen(true)}>
                {t("Create a new zone")}
              </OykButton>
            </OykFeedback>
          )}
        </section>
      )}
    </section>
  );
}
