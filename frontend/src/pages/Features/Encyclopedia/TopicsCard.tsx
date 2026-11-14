import type { Icon } from "@tabler/icons-react";
import { useRouter } from "@/services/router";
import { OykCard, OykProgressBar, OykStats } from "@/components/ui";

type OykEncyclopediaTopicsCardProps = {
  label: string;
  route: string;
  value: number;
  icon: Icon;
  color?: "accent" | "success" | "danger" | "info" | "warning" | "special";
};

export default function OykEncyclopediaTopicsCard({
  label,
  route,
  value,
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
            value={Math.floor(Math.random() * 100)}
            color={color}
          />
        </footer>
      </div>
    </OykCard>
  );
}
