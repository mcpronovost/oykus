import type { HTMLAttributes } from "react";
import type { Icon } from "@tabler/icons-react";
import { oykClass } from "@/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: number;
  shape?: "circle" | "square";
  clickable?: boolean;
  clickIcon?: Icon;
  clickLabel?: string;
  onClick?: () => void;
  className?: string;
}

export default function OykAvatar({
  src,
  alt,
  size = 64,
  shape = "circle",
  clickable = false,
  clickIcon: ClickIcon,
  clickLabel,
  onClick,
  className,
}: AvatarProps) {
  return (
    <div
      className={oykClass("oyk-avatar", `oyk-avatar-shape--${shape}`, className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="oyk-avatar-img" />
      ) : (
        <span className="oyk-avatar-label" style={{ fontSize: size * 0.3, lineHeight: `${size}px` }}>
          {alt?.toString().slice(0, 1).toUpperCase()}
        </span>
      )}
      {clickable ? (
        <button type="button" className="oyk-avatar-button" aria-label={clickLabel} onClick={onClick}>
          {ClickIcon && <ClickIcon size={size * 0.5} stroke={1.5} aria-hidden="true" />}
        </button>
      ) : null}
    </div>
  );
}
