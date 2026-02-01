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
  borderColor = "var(--oyk-card-bg)",
  borderSize = 2,
  borderRadius = "50%",
  level,
}) {
  const { isAuth } = useAuth();

  return (
    <div
      className="oyk-avatar"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="oyk-avatar-content"
        style={{
          backgroundColor: isAuth && src ? borderColor : bgColor,
          borderColor: borderColor,
          borderWidth: `${borderSize}px`,
          borderRadius: borderRadius,
          color: fgColor,
        }}
      >
        {isAuth && src ? (
          <img
            src={
              !src.startsWith("http") && !src.startsWith("blob") && !src.startsWith("data") ? `${DOMAIN}${src}` : src
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
        <span className="oyk-avatar-level">
          <span className="oyk-avatar-level-count">{level}</span>
        </span>
      ) : null}
    </div>
  );
}
