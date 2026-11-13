interface OykProgressBarProps {
  value: number;
  color?: "accent" | "success" | "danger" | "info" | "warning" | "special";
}

export default function OykProgressBar({
  value,
  color = "accent",
}: OykProgressBarProps) {
  return (
    <div className="oyk-progress-bar">
      <div
        className="oyk-progress-bar-fill"
        style={{
          background: `linear-gradient(to right, var(--oyk-c-${color}-subtle), var(--oyk-c-${color}))`,
          width: `${value}%`,
        }}
      ></div>
    </div>
  );
}
