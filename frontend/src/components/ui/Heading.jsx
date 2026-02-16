import { OykBreadcrumbs } from "@/components/common";

export default function OykHeading({
  title,
  description,
  prepend,
  actions,
  subtitle,
  showBreadcrumbs,
  nop,
  tag: Heading = "h1",
  className,
  children,
}) {
  return (
    <header
      className={["oyk-heading", nop ? "oyk-heading-nop" : "", subtitle ? "oyk-subtitle" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="oyk-heading-wrapper">
        <div className={`oyk-heading-content ${subtitle ? "oyk-subtitle" : ""}`}>
          {title ? (
            <Heading className={`oyk-heading-content-${subtitle ? "subtitle" : "title"}`}>{title}</Heading>
          ) : null}
          {description ? <p className="oyk-heading-content-description">{description}</p> : null}
          {prepend ? prepend : null}
        </div>
        {actions ? <div className="oyk-heading-actions">{actions}</div> : null}
      </div>
      {showBreadcrumbs ? <OykBreadcrumbs /> : null}
      {children ? <div className="oyk-heading-append">{children}</div> : null}
    </header>
  );
}
