import type { TypeSpace } from "@/services/api";
import { IconSettings } from "@tabler/icons-react";
import { OykButton, OykCard, OykStats } from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

type SpaceCurrentCardProps = {
  space: TypeSpace;
}

export default function OykSpaceCurrentCard({ space }: SpaceCurrentCardProps) {
  return (
    <OykCard outlined hoverable gradient="accent">
      <section className="oyk-page-dashboard-currentspace">
        <img
          src={space.cover || ImgPlaceholder1}
          alt={space.name}
          className="oyk-page-dashboard-currentspace-cover"
        />
        <div className="oyk-page-dashboard-currentspace-content">
          <header>
            <p className="oyk-page-dashboard-currentspace-content-suptitle">Continue working on</p>
            <h2 className="oyk-page-dashboard-currentspace-content-title">{space.name}</h2>
          </header>
          <OykStats justify="start">
            {/* On future Manuscript plugin: <OykStats.Item label="Words" value="0" /> */}
            <OykStats.Item label="Notes" value="2" />
            <OykStats.Item label="Characters" value="0" />
            <OykStats.Item label="Locations" value="0" />
            <OykStats.Item label="Events" value="0" />
          </OykStats>
          <footer className="oyk-page-dashboard-currentspace-content-actions">
             {/* On future Manuscript plugin: <OykButton routeName="manuscript" label="Continue Chapter" color="accent" /> */}
            <OykButton routeName="encyclopedia" label="Open Encyclopedia" />
            <OykButton variant="ghost" icon={IconSettings} shrink />
          </footer>
        </div>
      </section>
    </OykCard>
  );
}
