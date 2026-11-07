import type { HTMLAttributes, ReactNode } from "react";
import { oykClass } from "@/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  suptitle?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export default function OykHeading({
  suptitle,
  title,
  subtitle,
  actions,
  className,
  ...props
}: HeadingProps) {
  return (
    <header className={oykClass("oyk-heading", className)} {...props}>
      <hgroup className="oyk-heading-group">
        {suptitle && <p className="oyk-heading-group-suptitle">{suptitle}</p>}
        {title && <h1 className="oyk-heading-group-title">{title}</h1>}
        {subtitle && <p className="oyk-heading-group-subtitle">{subtitle}</p>}
      </hgroup>
      {actions && <div className="oyk-heading-actions">{actions}</div>}
    </header>
  );
}
