import type { CSSProperties } from "react";
import { useTranslation } from "@/services/translation";
import { OykButton } from "@/components/ui";
import { IconBooks, IconPuzzle, IconWorld } from "@tabler/icons-react";

const FEATURES = [
  { key: "spaces", icon: IconWorld },
  { key: "plugins", icon: IconPuzzle },
  { key: "stories", icon: IconBooks },
] as const;

export default function Home() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="oyk-home">
      <section className="oyk-home-hero" aria-labelledby="oyk-home-hero-brand">
        <div className="oyk-home-hero-atmosphere" aria-hidden="true" />
        <div className="oyk-home-hero-inner">
          <p id="oyk-home-hero-brand" className="oyk-home-hero-brand">
            {t("home.hero.brand")}
          </p>
          <h1 className="oyk-home-hero-headline">{t("home.hero.headline")}</h1>
          <p className="oyk-home-hero-subline">{t("home.hero.subline")}</p>
          <div className="oyk-home-hero-actions">
            <OykButton label={t("home.hero.login")} />
            <OykButton label={t("home.hero.register")} />
          </div>
        </div>
      </section>

      <section className="oyk-home-features" aria-labelledby="oyk-home-features-title">
        <div className="oyk-home-features-inner">
          <h2 id="oyk-home-features-title" className="oyk-home-features-title">
            {t("home.features.title")}
          </h2>
          <p className="oyk-home-features-subline">{t("home.features.subline")}</p>
          <ul className="oyk-home-features-list">
            {FEATURES.map(({ key, icon: Icon }, index) => (
              <li
                key={key}
                className="oyk-home-features-item"
                style={{ "--oyk-home-feature-delay": `${0.08 * (index + 1)}s` } as CSSProperties}
              >
                <Icon className="oyk-home-features-icon" size={28} stroke={1.5} aria-hidden="true" />
                <h3 className="oyk-home-features-item-title">{t(`home.features.${key}.title`)}</h3>
                <p className="oyk-home-features-item-body">{t(`home.features.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="oyk-home-cta" aria-labelledby="oyk-home-cta-title">
        <div className="oyk-home-cta-inner">
          <h2 id="oyk-home-cta-title" className="oyk-home-cta-title">
            {t("home.cta.title")}
          </h2>
          <p className="oyk-home-cta-subline">{t("home.cta.subline")}</p>
          <div className="oyk-home-cta-actions">
            <OykButton label={t("home.cta.login")} />
            <OykButton label={t("home.cta.register")} />
          </div>
        </div>
      </section>

      <footer className="oyk-home-footer">
        <div className="oyk-home-footer-inner">
          <p className="oyk-home-footer-brand">{t("home.footer.brand")}</p>
          <p className="oyk-home-footer-tagline">{t("home.footer.tagline")}</p>
          <p className="oyk-home-footer-rights">
            © {year} {t("home.footer.brand")}. {t("home.footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
