import { useAuth } from "@/services/auth";

import { OykBanner, OykCard, OykLink } from "@/components/ui";

export default function OykUniverseGameZoneSectorCard({ universe, zone, sector }) {
  const { currentUser } = useAuth();

  return (
    <OykCard fullCenter alignSpace nop clickable className="oyk-game-zone-sectors-card">
      <header className="oyk-game-zone-sectors-card-header">
        {sector.cover || sector.last ? (
          <OykBanner
            height={100}
            showAvatar={!!sector.last}
            avatarSrc={sector.last?.author?.avatar}
            avatarBorderSize={6}
            avatarTop={12}
            coverSrc={sector.cover}
          />
        ) : null}
        <h3 className="oyk-game-zone-sectors-card-header-title">
          <OykLink
            routeName="universe-game-sector"
            params={{
              universeSlug: universe.slug,
              zoneId: zone.id,
              sectorId: sector.id,
            }}
            block
            className="oyk-game-zone-sectors-card-header-title-link"
          >
            {sector.name}
          </OykLink>
        </h3>
      </header>
      <footer className="oyk-game-zone-sectors-card-footer">
        <div>
          {sector.last ? (
            <div className="oyk-game-zone-sectors-card-footer-last">
              <OykLink className="oyk-game-zone-sectors-card-footer-last-title">{sector.last.title}</OykLink>
            </div>
          ) : null}
        </div>
      </footer>
    </OykCard>
  );
}
