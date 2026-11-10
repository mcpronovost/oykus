import { IconX } from "@tabler/icons-react";
import type { TypeSpace } from "@/services/api";
import { OykButton } from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

type SpaceShelfCardProps = {
  space: TypeSpace;
  onSelect?: (space: TypeSpace) => void;
};

export default function OykSpaceShelfCard({
  space,
  onSelect,
}: SpaceShelfCardProps) {
  return (
    <div className="oyk-page-dashboard-shelf-item">
      <button className="oyk-page-dashboard-shelf-item-btn" onClick={() => onSelect?.(space)}>
        <div className="oyk-page-dashboard-shelf-item-cover">
          <img
            src={space.cover || ImgPlaceholder1}
            alt={space.name}
            draggable={false}
            loading="lazy"
            className="oyk-page-dashboard-shelf-item-cover-img"
          />
        </div>
        <p className="oyk-page-dashboard-shelf-item-name">{space.name}</p>
      </button>
      <div className="oyk-page-dashboard-shelf-item-delete">
        <OykButton icon={IconX} shrink color="danger" variant="plain" />
      </div>
    </div>
  );
}
