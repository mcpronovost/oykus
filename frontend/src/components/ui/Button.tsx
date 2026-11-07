import type { MouseEvent } from "react";
import type { IconProps as TablerIconProps } from "@tabler/icons-react";
import { oykClass } from "@/utils/formatters";
import { useRouter } from "@/services/router";

interface OykButtonProps {
  label?: string;
  icon?: React.ComponentType<TablerIconProps>;
  iconSize?: number;
  variant?: "default" | "pill" | "flat" | "ghost" | "plain";
  color?: "default" | "accent" | "success" | "danger" | "info" | "warning" | "special";
  customColor?: string;
  size?: "sm" | "md" | "lg";
  shrink?: boolean;
  disabled?: boolean;
  routeName?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function OykButton({
  label,
  icon: Icon,
  iconSize = 18,
  variant = "default",
  color = "default",
  customColor,
  size = "md",
  shrink,
  disabled,
  routeName,
  onClick,
}: OykButtonProps) {
  const { n } = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (routeName) {
      n(routeName);
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      className={oykClass("oyk-button", `oyk-button-variant--${variant}`, `oyk-button-color--${color}`, `oyk-button-size--${size}`, shrink && "oyk-button-shrink")}
      style={{
        ...(customColor && { color: customColor }),
      }}
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="oyk-button-bg" />
      <div className="oyk-button-content">
        {Icon && <Icon size={iconSize} />}
        {label && <span className="oyk-button-content-label">{label}</span>}
      </div>
    </button>
  );
}
