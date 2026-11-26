import type { HTMLAttributes } from "react";
import { oykClass } from "@/utils";
import OykAvatar from "./Avatar";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  coverSrc?: string | null;
  coverAlt?: string;
  coverSize?: number;
  avatarSrc?: string | null;
  avatarAlt?: string;
  avatarSize?: number;
  avatarShape?: "circle" | "square";
  avatarTop?: number;
  className?: string;
}

export default function OykBanner({
  size = 380,
  coverSrc,
  coverAlt,
  coverSize = 300,
  avatarSrc,
  avatarAlt,
  avatarSize = 200,
  avatarShape = "circle",
  avatarTop = 164,
  className,
}: BannerProps) {
  return (
    <div className={oykClass("oyk-banner", className)} style={{ height: size }}>
      <div className="oyk-banner-cover" style={{ height: coverSize }}>
        {coverSrc ? (
          <img src={coverSrc} alt={coverAlt} className="oyk-banner-cover-img" />
        ) : null}
      </div>
      <div className="oyk-banner-avatar" style={{ top: avatarTop }}>
        <OykAvatar src={avatarSrc} alt={avatarAlt} size={avatarSize} shape={avatarShape} />
      </div>
    </div>
  );
}
