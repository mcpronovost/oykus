import type { CSSProperties, SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { IconBooks, IconPuzzle, IconWorld } from "@tabler/icons-react";
import { OykButton } from "@/components/ui";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import ImgAsideAtmosphere from "@/assets/img/home-craft-atmosphere.jpg";

const FEATURES = [
  { key: "spaces", icon: IconWorld },
  { key: "plugins", icon: IconPuzzle },
  { key: "encyclopedia", icon: IconBooks },
] as const;

const INITIAL_FORM = {
  username: "",
  email: "",
  password: "",
  name: "",
  acceptTerms: false,
};

export default function Register() {
  const { t, tNode } = useTranslation();
  const { n, routeTitle } = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    routeTitle(t("auth.register.title"));
  }, [routeTitle, t]);

  const updateField = <K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.acceptTerms) return;
  };

  return (
    <div className="oyk-register">
      <section className="oyk-register-form-panel" aria-labelledby="oyk-register-title">
        <div className="oyk-register-form-inner">
          <p className="oyk-register-brand">{t("auth.register.brand")}</p>
          <h1 id="oyk-register-title" className="oyk-register-title">
            {t("auth.register.title")}
          </h1>
          <p className="oyk-register-subline">{t("auth.register.subline")}</p>

          <form className="oyk-register-form" onSubmit={handleSubmit} noValidate>
            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-register-username">
                {t("auth.register.username")}
              </label>
              <input
                id="oyk-register-username"
                className="oyk-register-input"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
              />
              <p className="oyk-register-hint">{t("auth.register.usernameHint")}</p>
            </div>

            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-register-email">
                {t("auth.register.email")}
              </label>
              <input
                id="oyk-register-email"
                className="oyk-register-input"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>

            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-register-password">
                {t("auth.register.password")}
              </label>
              <input
                id="oyk-register-password"
                className="oyk-register-input"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>

            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-register-name">
                {t("auth.register.name")}
              </label>
              <input
                id="oyk-register-name"
                className="oyk-register-input"
                name="name"
                type="text"
                autoComplete="nickname"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              <p className="oyk-register-hint">{t("auth.register.nameHint")}</p>
            </div>

            <div className="oyk-register-terms">
              <input
                id="oyk-register-terms"
                className="oyk-register-checkbox"
                name="acceptTerms"
                type="checkbox"
                required
                checked={form.acceptTerms}
                onChange={(event) => updateField("acceptTerms", event.target.checked)}
              />
              <label className="oyk-register-terms-label" htmlFor="oyk-register-terms">
                {tNode("auth.register.terms", undefined, {
                  terms: (
                    <a href="#" className="oyk-register-inline-link">
                      {t("auth.register.termsLink")}
                    </a>
                  ),
                  privacy: (
                    <a href="#" className="oyk-register-inline-link">
                      {t("auth.register.privacyLink")}
                    </a>
                  ),
                })}
              </label>
            </div>

            <div className="oyk-register-actions">
              <OykButton label={t("auth.register.submit")} disabled={!form.acceptTerms} />
            </div>
          </form>

          <p className="oyk-register-login">
            <span>{t("auth.register.haveAccount")}</span>
            <button type="button" className="oyk-register-login-link" onClick={() => n("login")}>
              {t("auth.register.login")}
            </button>
          </p>
        </div>
      </section>

      <aside className="oyk-register-aside-panel" aria-labelledby="oyk-register-aside-title">
        <div className="oyk-register-aside-atmosphere" aria-hidden="true">
          <img
            className="oyk-register-aside-atmosphere-img"
            src={ImgAsideAtmosphere}
            alt=""
            decoding="async"
          />
          <div className="oyk-register-aside-atmosphere-veil" />
          <div className="oyk-register-aside-glow" />
        </div>

        <div className="oyk-register-aside-inner">
          <p className="oyk-register-aside-kicker">{t("auth.register.aside.kicker")}</p>
          <h2 id="oyk-register-aside-title" className="oyk-register-aside-title">
            {t("auth.register.aside.title")}
          </h2>
          <p className="oyk-register-aside-subline">{t("auth.register.aside.subline")}</p>

          <ul className="oyk-register-features">
            {FEATURES.map(({ key, icon: Icon }, index) => (
              <li
                key={key}
                className="oyk-register-feature"
                style={{ "--oyk-register-feature-delay": `${0.18 + index * 0.08}s` } as CSSProperties}
              >
                <span className="oyk-register-feature-icon">
                  <Icon size={22} stroke={1.5} aria-hidden="true" />
                </span>
                <h3 className="oyk-register-feature-title">{t(`auth.register.aside.${key}.title`)}</h3>
                <p className="oyk-register-feature-body">{t(`auth.register.aside.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
