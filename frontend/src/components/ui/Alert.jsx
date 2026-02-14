import { Info, CircleCheck, CircleX, ShieldAlert } from "lucide-react";

export default function OykAlert({
  children,
  title,
  message,
  variant = "default",
  showIcon = true,
  icon: IconComponent,
  iconSize = 24,
  ghost = false,
  small = false
}) {
  return (
    <div className={`oyk-alert oyk-alert-variant-${variant} ${ghost ? "oyk-alert-ghost" : ""} ${small ? "oyk-small" : ""}`}>
      {showIcon && (
        <div className="oyk-alert-icon">
          {IconComponent ? (
            <IconComponent size={iconSize} />
          ) : variant === "danger" ? (
            <CircleX size={iconSize} />
          ) : variant === "warning" ? (
            <ShieldAlert size={iconSize} />
          ) : variant === "success" ? (
            <CircleCheck size={iconSize} />
          ) : (
            <Info size={iconSize} />
          )}
        </div>
      )}
      <div className="oyk-alert-content">
        {title && <p className="oyk-alert-content-title">{title}</p>}
        {message && <p className="oyk-alert-content-message">{message}</p>}
        {children}
      </div>
    </div>
  );
}