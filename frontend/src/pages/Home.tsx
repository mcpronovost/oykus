import type { CSSProperties } from "react";
import { useTranslation } from "@/services/translation";
import { OykButton } from "@/components/ui";
import {
  IconBooks,
  IconDice,
  IconMap,
  IconPencil,
  IconPuzzle,
  IconWorld,
} from "@tabler/icons-react";
import ImgLogo from "@/assets/img/oykus-1024.webp";
import ImgHeroAtmosphere from "@/assets/img/home-hero-atmosphere.jpg";
import ImgCraftAtmosphere from "@/assets/img/home-craft-atmosphere.jpg";

const FEATURES = [
  { key: "spaces", icon: IconWorld },
  { key: "plugins", icon: IconPuzzle },
  { key: "encyclopedia", icon: IconBooks },
] as const;

const CRAFT_PILLARS = [
  { key: "write", icon: IconPencil },
  { key: "plan", icon: IconMap },
  { key: "play", icon: IconDice },
] as const;

const FOOTER_MENUS = [
  { key: "product", items: ["spaces", "plugins", "encyclopedia"] },
  { key: "explore", items: ["guides", "changelog", "community"] },
  { key: "account", items: ["login", "register"] },
] as const;

export default function Home() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="oyk-home">
      <section className="oyk-home-hero" aria-labelledby="oyk-home-hero-brand">
        <div className="oyk-home-hero-atmosphere" aria-hidden="true">
          <img
            className="oyk-home-hero-atmosphere-img"
            src={ImgHeroAtmosphere}
            alt=""
            decoding="async"
          />
          <div className="oyk-home-hero-atmosphere-veil" />
          <div className="oyk-home-hero-glow" />
        </div>

        <div className="oyk-home-hero-frame">
          <div className="oyk-home-hero-copy">
            <p id="oyk-home-hero-brand" className="oyk-home-hero-brand">
              {t("home.hero.brand")}
            </p>
            <h1 className="oyk-home-hero-headline">{t("home.hero.headline")}</h1>
            <p className="oyk-home-hero-subline">{t("home.hero.subline")}</p>
            <div className="oyk-home-hero-actions">
              <OykButton label={t("home.hero.login")} routeName="login" />
              <OykButton label={t("home.hero.register")} routeName="register" />
            </div>
          </div>

          <div className="oyk-home-hero-visual" aria-hidden="true">
            <div className="oyk-home-hero-ring oyk-home-hero-ring--outer" />
            <div className="oyk-home-hero-ring oyk-home-hero-ring--mid" />
            <div className="oyk-home-hero-halo">
              <img className="oyk-home-hero-logo" src={ImgLogo} alt="" />
            </div>
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
                <span className="oyk-home-features-icon-wrap">
                  <span className="oyk-home-features-icon-inner">
                    <Icon className="oyk-home-features-icon" size={28} stroke={1.5} aria-hidden="true" />
                  </span>
                </span>
                <h3 className="oyk-home-features-item-title">{t(`home.features.${key}.title`)}</h3>
                <p className="oyk-home-features-item-body">{t(`home.features.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="oyk-home-craft" aria-labelledby="oyk-home-craft-title">
        <div className="oyk-home-craft-atmosphere" aria-hidden="true">
          <img
            className="oyk-home-craft-atmosphere-img"
            src={ImgCraftAtmosphere}
            alt=""
            decoding="async"
          />
          <div className="oyk-home-craft-atmosphere-veil" />
        </div>
        <div className="oyk-home-craft-inner">
          <div className="oyk-home-craft-intro">
            <h2 id="oyk-home-craft-title" className="oyk-home-craft-title">
              {t("home.craft.title")}
            </h2>
            <p className="oyk-home-craft-subline">{t("home.craft.subline")}</p>
          </div>
          <ul className="oyk-home-craft-list">
            {CRAFT_PILLARS.map(({ key, icon: Icon }) => (
              <li key={key} className="oyk-home-craft-item">
                <Icon className="oyk-home-craft-icon" size={22} stroke={1.5} aria-hidden="true" />
                <h3 className="oyk-home-craft-item-title">{t(`home.craft.${key}.title`)}</h3>
                <p className="oyk-home-craft-item-body">{t(`home.craft.${key}.body`)}</p>
              </li>
            ))}
          </ul>
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
