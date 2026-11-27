import type { HTMLAttributes } from "react";
import type { Icon } from "@tabler/icons-react";
import { oykClass } from "@/utils";
import OykAvatar from "./Avatar";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  coverSrc?: string | null;
  coverAlt?: string;
  coverSize?: number;
  coverClickable?: boolean;
  coverClickIcon?: Icon;
  coverClickLabel?: string;
  coverOnClick?: () => void;
  avatarSrc?: string | null;
  avatarAlt?: string;
  avatarSize?: number;
  avatarShape?: "circle" | "square";
  avatarTop?: number;
  avatarClickable?: boolean;
  avatarClickIcon?: Icon;
  avatarClickLabel?: string;
  avatarOnClick?: () => void;
  className?: string;
}

export default function OykBanner({
  size = 380,
  coverSrc,
  coverAlt,
  coverSize = 300,
  coverClickable = false,
  coverClickIcon: ClickIcon,
  coverClickLabel,
  coverOnClick,
  avatarSrc,
  avatarAlt,
  avatarSize = 200,
  avatarShape = "circle",
  avatarTop = 164,
  avatarClickable = false,
  avatarClickIcon,
  avatarClickLabel,
  avatarOnClick,
  className,
}: BannerProps) {
  return (
    <div className={oykClass("oyk-banner", className)} style={{ height: size }}>
      <div className="oyk-banner-cover" style={{ height: coverSize }}>
        {coverSrc ? <img src={coverSrc} alt={coverAlt} className="oyk-banner-cover-img" /> : null}
        {coverClickable ? (
          <button type="button" className="oyk-banner-cover-button" aria-label={coverClickLabel} onClick={coverOnClick}>
            {ClickIcon && <ClickIcon size={coverSize * 0.5} stroke={1.5} aria-hidden="true" />}
          </button>
        ) : null}
      </div>
      <div className="oyk-banner-avatar" style={{ top: avatarTop }}>
        <OykAvatar
          src={avatarSrc}
          alt={avatarAlt}
          size={avatarSize}
          shape={avatarShape}
          clickable={avatarClickable}
          clickIcon={avatarClickIcon}
          clickLabel={avatarClickLabel}
          onClick={avatarOnClick}
        />
      </div>
    </div>
  );
}
