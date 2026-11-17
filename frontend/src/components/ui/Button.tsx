import type { CSSProperties, MouseEvent } from "react";
import type { Icon } from "@tabler/icons-react";
import { IconLoader } from "@tabler/icons-react";
import { oykClass } from "@/utils/formatters";
import { useRouter } from "@/services/router";

interface OykButtonProps {
  type?: "button" | "submit" | "reset";
  form?: string;
  label?: string;
  start?: Icon;
  end?: Icon;
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
  justify?: "start" | "center" | "end";
  grow?: boolean;
  shrink?: boolean;
  loading?: boolean;
  disabled?: boolean;
  routeName?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function OykButton({
  type = "button",
  form,
  label,
  start: IconStart,
  end: IconEnd,
  iconSize = 15,
  variant = "default",
  color = "default",
  customColor,
  size = "md",
  justify = "center",
  grow,
  shrink,
  loading,
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
        `oyk-color-${color}`,
        `oyk-variant-${variant}`,
        `oyk-button-size--${size}`,
        grow && "oyk-button-grow",
        shrink && "oyk-button-shrink",
      )}
      style={
        customColor
          ? ({
              "--oyk-button-bg": customColor,
              "--oyk-button-fg": customColor,
              "--oyk-button-border": customColor,
            } as CSSProperties)
          : undefined
      }
      type={type}
      form={form}
      disabled={disabled}
      onClick={handleClick}
    >
      {loading && (
        <div className="oyk-button-loading">
          <IconLoader size={iconSize} stroke={1.5} />
        </div>
      )}
      <div className={oykClass("oyk-button-content", (shrink && (IconStart || IconEnd) && !label) && "oyk-ratio", justify && `oyk-justify--${justify}`)}>
        {IconStart && (
          <span className="oyk-button-content-start">
            <IconStart size={iconSize} stroke={1.5} />
          </span>
        )}
        {label && <span className="oyk-button-content-label">{label}</span>}
        {IconEnd && (
          <span className="oyk-button-content-end">
            <IconEnd size={iconSize} stroke={1.5} />
          </span>
        )}
      </div>
    </button>
  );
}
