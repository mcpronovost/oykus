import type { HTMLAttributes, ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { oykClass } from "@/utils";

type OykHeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface OykHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  tag?: OykHeadingTag;
  suptitle?: string;
  title?: string;
  subtitle?: string;
  icon?: Icon;
  actions?: ReactNode;
  variant?: "default" | "card";
  className?: string;
}

export default function OykHeading({
  tag = "h1",
  suptitle,
  title,
  subtitle,
  icon: IconComponent,
  actions,
  variant = "default",
  className,
  ...props
}: OykHeadingProps) {
  const HeadingComponent = tag as OykHeadingTag;

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
        {title && <HeadingComponent className="oyk-heading-group-title">{title}</HeadingComponent>}
        {subtitle && <p className="oyk-heading-group-subtitle">{subtitle}</p>}
      </hgroup>
      {actions && <div className="oyk-heading-actions">{actions}</div>}
    </header>
  );
}
