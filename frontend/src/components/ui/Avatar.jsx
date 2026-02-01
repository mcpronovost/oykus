import { useMemo } from "react";
import { User } from "lucide-react";

import { DOMAIN } from "@/services/api/utils";
import { useAuth } from "@/services/auth";

export default function OykAvatar({
  name = "",
  abbr = "",
  src,
  icon: IconComponent = User,
  size = 64,
  bgColor = "var(--oyk-c-primary)",
  fgColor = "var(--oyk-c-primary-fg)",
  borderSize = 2,
  borderColor = "var(--oyk-card-bg)",
  borderRadius = "50%",
  level,
  levelSize = 24,
  levelBorderSize = 2,
  levelBorderColor = "var(--oyk-card-bg)",
  isPrivate = true,
}) {
  const { isAuth } = useAuth();

  const showImg = useMemo(() => !isPrivate || (isPrivate && isAuth), [isPrivate, isAuth]);

  return (
    <div
      className="oyk-avatar"
      style={{
        width: `${size + borderSize * 2}px`,
        height: `${size + borderSize * 2}px`,
      }}
    >
      <div
        className="oyk-avatar-content"
        style={{
          backgroundColor: showImg && src ? borderColor : bgColor,
          borderColor: borderColor,
          borderWidth: `${borderSize}px`,
          borderRadius: borderRadius,
          color: fgColor,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {showImg && src ? (
          <img
            src={
              !src.startsWith("http") && !src.startsWith("blob") && !src.startsWith("data") && !src.startsWith("/src")
                ? `${DOMAIN}${src}`
                : src
            }
            alt={name}
            className="oyk-avatar-img"
          />
        ) : abbr || name ? (
          <span className="oyk-avatar-abbr" style={{ fontSize: size * 0.35 }}>
            {abbr || name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="oyk-avatar-icon">
            <IconComponent size={size * 0.5} />
          </span>
        )}
      </div>
      {level ? (
        <span
          className="oyk-avatar-level"
          style={{
            borderWidth: `${levelBorderSize}px`,
            borderColor: levelBorderColor,
            fontSize: levelSize * 0.5,
            minWidth: `${levelSize + levelBorderSize}px`,
          }}
        >
          <span className="oyk-avatar-level-count">{level}</span>
        </span>
      ) : null}
    </div>
  );
}
