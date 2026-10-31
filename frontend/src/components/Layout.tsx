import ImgLogo from "@/assets/img/oykus-48.webp";

interface OykLayoutProps {
  children: React.ReactNode;
}

export default function OykLayout({ children }: OykLayoutProps) {
  return (
    <div className="oyk-core">
      <div className="oyk-core-header">
        <div className="oyk-core-header-brand">
          <div className="oyk-core-header-brand-logo">
            <img src={ImgLogo} alt="Oykus" />
          </div>
          <div className="oyk-core-header-brand-name">
            <span className="oyk-core-header-brand-name-title">Oykus</span>
            <span className="oyk-core-header-brand-name-subtitle">
              Story Planner
            </span>
          </div>
        </div>
      </div>
      <div className="oyk-core-nav">nav</div>
      <div className="oyk-core-main">{children}</div>
    </div>
  );
}
