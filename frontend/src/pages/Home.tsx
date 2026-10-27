import type { CSSProperties } from "react";
import { useTranslation } from "@/services/translation";
import { OykButton } from "@/components/ui";
import { IconBooks, IconPuzzle, IconWorld } from "@tabler/icons-react";

const FEATURES = [
  { key: "spaces", icon: IconWorld },
  { key: "plugins", icon: IconPuzzle },
  { key: "stories", icon: IconBooks },
] as const;

const FOOTER_MENUS = [
  { key: "product", items: ["spaces", "plugins", "stories"] },
  { key: "explore", items: ["guides", "changelog", "community"] },
  { key: "account", items: ["login", "register"] },
] as const;

export default function Home() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="oyk-home">
      <section className="oyk-home-hero" aria-labelledby="oyk-home-hero-brand">
        <div className="oyk-home-hero-frame">
          <div className="oyk-home-hero-copy">
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
          <div className="oyk-home-hero-panel" aria-hidden="true">
            <div className="oyk-home-hero-panel-block oyk-home-hero-panel-block--a" />
            <div className="oyk-home-hero-panel-block oyk-home-hero-panel-block--b" />
            <div className="oyk-home-hero-panel-block oyk-home-hero-panel-block--c" />
            <div className="oyk-home-hero-panel-rule" />
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
          <p className="oyk-home-footer-phrase">{t("home.footer.phrase")}</p>

          <div className="oyk-home-footer-grid">
            <div className="oyk-home-footer-brand-block">
              <p className="oyk-home-footer-brand">{t("home.footer.brand")}</p>
              <p className="oyk-home-footer-blurb">{t("home.footer.blurb")}</p>
            </div>

            {FOOTER_MENUS.map(({ key, items }) => (
              <nav key={key} className="oyk-home-footer-menu" aria-labelledby={`oyk-home-footer-${key}`}>
                <p id={`oyk-home-footer-${key}`} className="oyk-home-footer-menu-title">
                  {t(`home.footer.menus.${key}.title`)}
                </p>
                <ul className="oyk-home-footer-menu-list">
                  {items.map((item) => (
                    <li key={item}>
                      <button type="button" className="oyk-home-footer-link">
                        {t(`home.footer.menus.${key}.${item}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="oyk-home-footer-bottom">
            <p className="oyk-home-footer-tagline">{t("home.footer.tagline")}</p>
            <p className="oyk-home-footer-rights">
              © {year} {t("home.footer.brand")}. {t("home.footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
