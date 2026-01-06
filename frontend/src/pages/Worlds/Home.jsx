import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykCard, OykFeedback, OykGrid, OykHeading, OykLoading } from "@/components/common";
import { OykWorldHeader } from "@/components/world";

export default function WorldHome() {
  const { params } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [world, setWorld] = useState(null);

  const getWorld = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const data = await api.get(`/world/${params.worldSlug}`);
      setWorld(data.world);
    } catch (e) {
      console.error(e);
      setHasError(e?.error?.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWorld();
  }, []);

  return (
    <section className="oyk-page oyk-world">
      {hasError ? (
        <OykGrid>
          <OykFeedback variant="danger" message={hasError} ghost />
        </OykGrid>
      ) : isLoading ? (
        <OykLoading />
      ) : world ? (
        <>
          <OykWorldHeader world={world} />
          <OykGrid>
            <section className="oyk-world-areas">
              {world.areas.map((area) => (
                <article key={area.id} className="oyk-world-areas-item">
                  <OykHeading title={area.name} ph={0} />
                  <section className="oyk-world-sectors">
                    {area.sectors.map((sector) => (
                      <article key={sector.id} className="oyk-world-sectors-item" style={{ gridColumn: "span 4" }}>
                        <OykCard>
                          <h3>{sector.name}</h3>
                        </OykCard>
                      </article>
                    ))}
                    {area.sectors.map((sector) => (
                      <article key={sector.id} className="oyk-world-sectors-item" style={{ gridColumn: "span 2" }}>
                        <OykCard>
                          <h3>{sector.name}</h3>
                        </OykCard>
                      </article>
                    ))}
                    {area.sectors.map((sector) => (
                      <article key={sector.id} className="oyk-world-sectors-item" style={{ gridColumn: "span 2" }}>
                        <OykCard>
                          <h3>{sector.name}</h3>
                        </OykCard>
                      </article>
                    ))}
                    {area.sectors.map((sector) => (
                      <article key={sector.id} className="oyk-world-sectors-item">
                        <OykCard>
                          <h3>{sector.name}</h3>
                        </OykCard>
                      </article>
                    ))}
                    {area.sectors.map((sector) => (
                      <article key={sector.id} className="oyk-world-sectors-item">
                        <OykCard>
                          <h3>{sector.name}</h3>
                        </OykCard>
                      </article>
                    ))}
                  </section>
                </article>
              ))}
            </section>
          </OykGrid>
        </>
      ) : (
        <OykGrid>
          <OykFeedback variant="danger" message={t("An error occurred")} ghost />
        </OykGrid>
      )}
    </section>
  );
}
