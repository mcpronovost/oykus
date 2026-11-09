import type { HTMLAttributes, ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { useState } from "react";
import { IconAlertCircle, IconInfoCircle, IconCircleCheck, IconAlertTriangle, IconX } from "@tabler/icons-react";
import { oykClass } from "@/utils";

interface ResultProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
  message?: string;
  variant?: "default" | "ghost";
  color?: "default" | "accent" | "success" | "danger" | "info" | "warning" | "special";
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

export default function OykResult({
  title,
  message,
  variant = "default",
  color = "default",
  closable = false,
  icon: IconComponent,
  onClose,
  className = "",
  children,
  ...props
}: ResultProps) {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  const ResolvedIcon = IconComponent ?? DEFAULT_ICONS[color];

  const handleClose = () => {
    if (!closable) return;
    setIsClosed(true);
    onClose?.();
  };

  return (
    <div
      className={oykClass("oyk-result", `oyk-color-${color}`, `oyk-variant-${variant}`, className)}
      {...props}
    >
      <div className="oyk-result-bg" />
      <div className="oyk-result-icon">
        <ResolvedIcon size={64} stroke={1} />
      </div>
      <div className="oyk-result-content">
        {title && <div className="oyk-result-content-title">{title}</div>}
        {message && <div className="oyk-result-content-message">{message}</div>}
        {children}
      </div>
      {closable && (
        <button type="button" className="oyk-result-close" onClick={handleClose} aria-label="Close">
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
