export default function OykHeading({ title, description, actions, ph = 32 }) {
  return (
    <header className="oyk-heading" style={{ padding: `0 ${ph}px` }}>
      <div className="oyk-heading-wrapper">
        <div className="oyk-heading-content">
          {title && <h1 className="oyk-heading-content-title">{title}</h1>}
          {description && <p className="oyk-heading-content-description">{description}</p>}
        </div>
        {actions && <div className="oyk-heading-actions">{actions}</div>}
      </div>
    </header>
  );
}