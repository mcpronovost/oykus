import { useEffect, useState } from "react";
import { Construction } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol, OykHeading, OykLink } from "@/components/ui";

export default function Discover() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [universes, setUniverses] = useState([]);

  const fetchUniverses = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/world/universes/", signal ? { signal } : {});
      if (!r.ok || !r.universes) throw Error();
      setUniverses(r.universes);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Discover"));
    fetchUniverses(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-discover">
      <OykHeading title={t("Discover")} />
      <OykGrid>
        {universes?.length > 0 ? (
          <OykGridRow wrap>
            {universes.map((u, index) => (
              <OykGridCol key={index} col="25" md="50" sm="100">
                <OykCard nop fullCenter>
                  <header>
                    <OykBanner
                      avatarSrc={u.logo}
                      avatarAbbr={u.abbr}
                      avatarBgColor={u.c_primary}
                      avatarFgColor={u.c_primary_fg}
                      avatarBorderSize={6}
                      coverSrc={u.cover}
                      height={148}
                    />
                    <h2>
                      <OykLink routeName="universe" params={{ universeSlug: u.slug }}>
                        {u.name}
                      </OykLink>
                    </h2>
                    <p>&nbsp;</p>
                  </header>
                </OykCard>
              </OykGridCol>
            ))}
          </OykGridRow>
        ) : null}
      </OykGrid>
    </section>
  );
}
