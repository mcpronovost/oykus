import type { Icon } from "@tabler/icons-react";
import { useRouter } from "@/services/router";
import { OykCard, OykProgressBar, OykStats } from "@/components/ui";

type OykEncyclopediaTopicsCardProps = {
  label: string;
  route: string;
  value: number;
  total: number;
  icon: Icon;
  color?: string;
};

export default function OykEncyclopediaTopicsCard({
  label,
  route,
  value,
  total,
  icon: IconComponent,
  color = "accent",
}: OykEncyclopediaTopicsCardProps) {
  const { n } = useRouter();

  const handleClick = () => {
    n(route);
  };

  return (
    <OykCard
      gradient={color}
      outlined
      hoverable
      clickable
      onClick={handleClick}
    >
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
            value={Math.floor((value / total) * 100) || 0}
            color={color}
          />
        </footer>
      </div>
    </OykCard>
  );
}
