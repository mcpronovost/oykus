import { DOMAIN } from "@/services/api/utils";
import OykAvatar from "./Avatar";

export default function OykBanner({
  children,
  avatarSrc,
  avatarAbbr,
  avatarSize,
  avatarBorderSize,
  avatarBorderColor,
  avatarTop = 64,
  showAvatar = true,
  height = 170,
  coverSrc,
  coverHeight = 100,
  coverRadius = "var(--oyk-radius)",
  className,
}) {
  return (
    <div
      className={`oyk-banner ${className ? className : ""}`}
      style={{ height: `${height}px` }}
    >
      <div
        className="oyk-banner-cover"
        style={{
          borderTopLeftRadius: coverRadius,
          borderTopRightRadius: coverRadius,
          height: `${coverHeight}px`,
        }}
      >
        <div
          className="oyk-banner-cover-image"
          style={{
            backgroundImage: coverSrc
              ? `url(${
                  (!coverSrc.startsWith("http") && !coverSrc.startsWith("blob")) ? `${DOMAIN}${coverSrc}` : coverSrc
                })`
              : "none",
            height: `${coverHeight}px`,
          }}
        ></div>
      </div>
      {showAvatar && (
        <div className="oyk-banner-avatar" style={{ top: `${avatarTop}px` }}>
          <OykAvatar
            src={avatarSrc}
            abbr={avatarAbbr}
            size={avatarSize}
            borderSize={avatarBorderSize}
            borderColor={avatarBorderColor}
          />
        </div>
      )}
      {children}
    </div>
  );
}
