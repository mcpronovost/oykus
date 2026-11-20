import type { HTMLAttributes } from "react";
import { oykClass } from "@/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: number;
  shape?: "circle" | "square";
  className?: string;
}

export default function OykAvatar({ src, alt, size = 64, shape = "circle", className }: AvatarProps) {
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
    </div>
  );
}
