import { oykClass } from "@/utils/formatters";

interface OykChipProps {
  children: React.ReactNode;
  variant?: "default" | "pill" | "outline" | "ghost";
  color?: "default" | "accent";
  customColor?: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function OykChip({
  children,
  variant = "default",
  color = "default",
  customColor,
  size = "md",
  clickable = false,
  className,
  style,
}: OykChipProps) {
  return (
    <div
      className={oykClass(
        "oyk-chip",
        `oyk-chip-variant--${variant}`,
        `oyk-chip-size--${size}`,
        `oyk-chip-color--${color}`,
        clickable && "oyk-chip-clickable",
        className,
      )}
      style={{
        ...style,
        ...(customColor && { color: customColor }),
      }}
    >
      <div className="oyk-chip-bg" />
      <div className="oyk-chip-content">{children}</div>
    </div>
  );
}
