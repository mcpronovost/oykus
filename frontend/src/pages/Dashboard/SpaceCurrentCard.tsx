import type { TypeSpace } from "@/services/api";
import { OykCard } from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

type SpaceCurrentCardProps = {
  space: TypeSpace;
}

export default function OykSpaceCurrentCard({ space }: SpaceCurrentCardProps) {
  return (
    <OykCard outlined hoverable gradient="accent">
      <div className="oyk-page-dashboard-currentspace">
        <img
          src={space.cover || ImgPlaceholder1}
          alt={space.name}
          className="oyk-page-dashboard-currentspace-cover"
        />
        <div className="oyk-page-dashboard-currentspace-content">
          <p className="oyk-page-dashboard-currentspace-content-suptitle">Continue working on</p>
          <h2 className="oyk-page-dashboard-currentspace-content-title">{space.name}</h2>
        </div>
      </div>
    </OykCard>
  );
}
