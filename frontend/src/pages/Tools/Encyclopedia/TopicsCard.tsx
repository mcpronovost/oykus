import type { Icon } from "@tabler/icons-react";
import { OykCard, OykProgressBar, OykStats } from "@/components/ui";

type OykEncyclopediaTopicsCardProps = {
  label: string;
  value: number;
  icon: Icon;
  color?: "accent" | "success" | "danger" | "info" | "warning" | "special";
};

export default function OykEncyclopediaTopicsCard({
  label,
  value,
  icon: IconComponent,
  color = "accent",
}: OykEncyclopediaTopicsCardProps) {
  return (
    <OykCard gradient={color} outlined hoverable>
      <div className="oyk-page-encyclopedia-topics-card">
        <div
          className="oyk-page-encyclopedia-topics-card-icon"
          style={{
            backgroundColor: `var(--oyk-c-${color}-faint)`,
            borderColor: `var(--oyk-c-${color}-subtle)`,
          }}
        >
          <IconComponent size={16} color={`var(--oyk-c-${color})`} />
        </div>
        <OykStats justify="start">
          <OykStats.Item label={label} value={value} valueColor={color} />
        </OykStats>
        <footer className="oyk-page-encyclopedia-topics-card-footer">
          <OykProgressBar
            value={Math.floor(Math.random() * 100)}
            color={color}
          />
        </footer>
      </div>
    </OykCard>
  );
}
