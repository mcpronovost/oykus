import type { MouseEvent } from "react";
import type { IconProps as TablerIconProps } from "@tabler/icons-react";
import { oykClass } from "@/utils/formatters";
import { useRouter } from "@/services/router";

interface OykButtonProps {
  type?: "button" | "submit" | "reset";
  form?: string;
  label?: string;
  icon?: React.ComponentType<TablerIconProps>;
  iconSize?: number;
  variant?: "default" | "pill" | "flat" | "ghost" | "plain";
  color?:
    | "default"
    | "accent"
    | "success"
    | "danger"
    | "info"
    | "warning"
    | "special";
  customColor?: string;
  size?: "sm" | "md" | "lg";
  grow?: boolean;
  shrink?: boolean;
  disabled?: boolean;
  routeName?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function OykButton({
  type = "button",
  form,
  label,
  icon: Icon,
  iconSize = 16,
  variant = "default",
  color = "default",
  customColor,
  size = "md",
  grow,
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
      className={oykClass(
        "oyk-button",
        `oyk-button-variant--${variant}`,
        `oyk-button-color--${color}`,
        `oyk-button-size--${size}`,
        grow && "oyk-button-grow",
        shrink && "oyk-button-shrink",
      )}
      style={{
        ...(customColor && { color: customColor }),
      }}
      type={type}
      form={form}
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
