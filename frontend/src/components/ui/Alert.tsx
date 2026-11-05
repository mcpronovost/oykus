import type { HTMLAttributes, ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { useState } from "react";
import { IconAlertCircle, IconInfoCircle, IconCircleCheck, IconAlertTriangle, IconX } from "@tabler/icons-react";
import { oykClass } from "@/utils";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
  message?: string;
  type?: "default" | "accent" | "success" | "danger" | "info" | "warning" | "special";
  variant?: "default" | "ghost";
  icon?: Icon;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const DEFAULT_ICONS = {
  default: IconAlertCircle,
  accent: IconInfoCircle,
  success: IconCircleCheck,
  danger: IconAlertCircle,
  info: IconInfoCircle,
  warning: IconAlertTriangle,
  special: IconAlertCircle,
} as const;

export default function OykAlert({
  title,
  message,
  type = "default",
  variant = "default",
  closable = false,
  icon: IconComponent,
  onClose,
  className = "",
  children,
  ...props
}: AlertProps) {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  const ResolvedIcon = IconComponent ?? DEFAULT_ICONS[type];

  const handleClose = () => {
    if (!closable) return;
    setIsClosed(true);
    onClose?.();
  };

  return (
    <div
      className={oykClass("oyk-alert", `oyk-type-${type}`, `oyk-variant-${variant}`, className)}
      {...props}
    >
      <div className="oyk-alert-icon">
        <ResolvedIcon size={24} />
      </div>
      <div className="oyk-alert-content">
        {title && <div className="oyk-alert-content-title">{title}</div>}
        {message && <div className="oyk-alert-content-message">{message}</div>}
        {children}
      </div>
      {closable && (
        <button type="button" className="oyk-alert-close" onClick={handleClose} aria-label="Close">
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
