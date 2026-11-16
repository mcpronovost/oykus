import type { HTMLAttributes, ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { oykClass } from "@/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  suptitle?: string;
  title?: string;
  subtitle?: string;
  icon?: Icon;
  actions?: ReactNode;
  variant?: "default" | "card";
  className?: string;
}

export default function OykHeading({
  suptitle,
  title,
  subtitle,
  icon: IconComponent,
  actions,
  variant = "default",
  className,
  ...props
}: HeadingProps) {
  return (
    <header
      className={oykClass(
        "oyk-heading",
        `oyk-heading-variant--${variant}`,
        className,
      )}
      {...props}
    >
      {IconComponent && (
        <div className="oyk-heading-icon">
          <IconComponent size={24} />
        </div>
      )}
      <hgroup className="oyk-heading-group">
        {suptitle && <p className="oyk-heading-group-suptitle">{suptitle}</p>}
        {title && <h1 className="oyk-heading-group-title">{title}</h1>}
        {subtitle && <p className="oyk-heading-group-subtitle">{subtitle}</p>}
      </hgroup>
      {actions && <div className="oyk-heading-actions">{actions}</div>}
    </header>
  );
}
