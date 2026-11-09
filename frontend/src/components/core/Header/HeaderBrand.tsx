import ImgLogo from "@/assets/img/oykus-48.webp";

export default function OykCoreHeaderBrand() {
  return (
    <div className="oyk-core-header-brand">
      <div className="oyk-core-header-brand-logo">
        <img src={ImgLogo} alt="Oykus" />
      </div>
      <div className="oyk-core-header-brand-name">
        <span className="oyk-core-header-brand-name-title">Oykus</span>
        <span className="oyk-core-header-brand-name-subtitle">
          Storytelling Planner
        </span>
      </div>
    </div>
  );
}
