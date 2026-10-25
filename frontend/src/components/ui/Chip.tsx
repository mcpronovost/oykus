import { oykClass } from "@/utils/formatters";

interface OykChipProps {
  children: React.ReactNode;
  variant?: "default" | "pill";
  color?: "default" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export default function OykChip({
  children,
  variant = "default",
  color = "default",
  size = "md",
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
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
