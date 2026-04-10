import { useMemo } from "react";

import { useAuth } from "@/services/auth";

import { OykBanner, OykCard, OykLink } from "@/components/ui";

export default function OykUniverseGameZoneSectorCard({ universe, zone, sector, division }) {
  const { currentUser } = useAuth();

  const item = useMemo(() => (division || sector), [sector, division]);

  return (
    <OykCard fullCenter alignSpace nop clickable className="oyk-game-zone-sectors-card">
      <header className="oyk-game-zone-sectors-card-header">
        {item.cover || item.last ? (
          <OykBanner
            height={100}
            showAvatar={!!item.last}
            avatarSrc={item.last?.author?.avatar}
            avatarBorderSize={6}
            avatarTop={12}
            coverSrc={item.cover}
          />
        ) : null}
        <h3 className="oyk-game-zone-sectors-card-header-title">
          <OykLink
            routeName={division ? "universe-game-division" : "universe-game-sector"}
            params={{
              universeSlug: universe.slug,
              zoneId: zone.id,
              sectorId: sector.id,
              divisionId: division?.id,
            }}
            block
            className="oyk-game-zone-sectors-card-header-title-link"
          >
            {item.name}
          </OykLink>
        </h3>
      </header>
      <footer className="oyk-game-zone-sectors-card-footer">
        <div>
          {item.last ? (
            <div className="oyk-game-zone-sectors-card-footer-last">
              <OykLink className="oyk-game-zone-sectors-card-footer-last-title">{item.last.title}</OykLink>
            </div>
          ) : null}
        </div>
      </footer>
    </OykCard>
  );
}
