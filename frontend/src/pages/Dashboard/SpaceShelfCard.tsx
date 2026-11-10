import type { TypeSpace } from "@/services/api";
import { OykCard } from "@/components/ui";
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
      <OykCard hoverable clickable nop onClick={() => onSelect?.(space)}>
        <div className="oyk-page-dashboard-shelf-item-cover">
          <img
            src={space.cover || ImgPlaceholder1}
            alt={space.name}
            className="oyk-page-dashboard-shelf-item-cover-img"
          />
        </div>
      </OykCard>
      <p className="oyk-page-dashboard-shelf-item-name">{space.name}</p>
    </div>
  );
}
