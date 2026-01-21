import { Info, CircleCheck, CircleX, ShieldAlert } from "lucide-react";

export default function OykAlert({
  children,
  title,
  message,
  variant = "default",
  showIcon = true,
  icon: IconComponent,
  iconSize = 24,
}) {
  return (
    <div className={`oyk-alert oyk-alert-variant-${variant}`}>
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