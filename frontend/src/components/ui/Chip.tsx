import type { CSSProperties, ReactNode } from "react";
import { oykClass } from "@/utils/formatters";

interface OykChipProps {
  children?: ReactNode;
  label?: string;
  variant?: "default" | "pill" | "outline" | "ghost";
  color?: "default" | "accent" | "success" | "danger" | "info" | "warning" | "special";
  customColor?: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function OykChip({
  children,
  label,
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
        `oyk-color-${color}`,
        `oyk-variant-${variant}`,
        `oyk-chip-size--${size}`,
        clickable && "oyk-chip-clickable",
        className,
      )}
      style={{
        ...style,
        ...(customColor
          ? ({
              "--oyk-chip-bg": customColor,
              "--oyk-chip-fg": customColor,
              "--oyk-chip-border": customColor,
            } as CSSProperties)
          : null),
      }}
    >
      <div className="oyk-chip-content">{children || label}</div>
    </div>
  );
}
