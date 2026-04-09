import { OykLink } from "@/components/ui";
import { OykBreadcrumbs } from "@/components/common";

export default function OykHeading({
  title,
  description,
  prepend,
  actions,
  subtitle,
  showBreadcrumbs,
  titleLink,
  nop,
  tag: Heading = "h1",
  full = false,
  className,
  children,
}) {
  return (
    <header
      className={["oyk-heading", nop ? "oyk-heading-nop" : "", subtitle ? "oyk-subtitle" : "", full ? "oyk-heading-full" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="oyk-heading-wrapper">
        <div className={`oyk-heading-content ${subtitle ? "oyk-subtitle" : ""}`}>
          {title ? (
            <Heading className={`oyk-heading-content-${subtitle ? "subtitle" : "title"}`}>
              {titleLink ? (
                <OykLink routeName={titleLink.routeName} params={titleLink.params}>{title}</OykLink>
              ) : title}
            </Heading>
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
