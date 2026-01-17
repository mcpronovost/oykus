import { Info, CircleCheck, CircleX, ShieldAlert } from "lucide-react";

export default function OykFeedback({
  children,
  title,
  message,
  variant = "default",
  showIcon = true,
  icon: IconComponent,
  iconSize = 64,
  ghost = false,
}) {
  return (
    <div className={`oyk-feedback oyk-feedback-variant-${variant} ${ghost ? "oyk-feedback-ghost" : ""}`}>
      {showIcon && (
        <div className="oyk-feedback-icon">
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
      <div className="oyk-feedback-content">
        {title && <p className="oyk-feedback-content-title">{title}</p>}
        {message && <p className="oyk-feedback-content-message">{message}</p>}
        {children && <div className="oyk-feedback-content-children">{children}</div>}
      </div>
    </div>
  );
}