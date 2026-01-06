import { OykCard,OykGrid } from "@/components/common";

export default function OykWorldHeader({ world }) {
  return (
    <header className="oyk-world-header">
      <OykGrid>
        <OykCard>
          <h1 className="oyk-world-header-title">
            <span>{world.name}</span>
          </h1>
        </OykCard>
      </OykGrid>
    </header>
  );
}
