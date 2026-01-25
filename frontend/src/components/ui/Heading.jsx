export default function OykHeading({ title, description, subtitle, actions, ph = 32, tag: Heading = "h1" }) {
  return (
    <header className={`oyk-heading ${subtitle ? "oyk-subtitle" : ""}`} style={{ padding: `0 ${ph}px` }}>
      <div className="oyk-heading-wrapper">
        <div className={`oyk-heading-content ${subtitle ? "oyk-subtitle" : ""}`}>
          {title && <Heading className={`oyk-heading-content-${subtitle ? "subtitle" : "title"}`}>{title}</Heading>}
          {description && <p className="oyk-heading-content-description">{description}</p>}
        </div>
        {actions && <div className="oyk-heading-actions">{actions}</div>}
      </div>
    </header>
  );
}