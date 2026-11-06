import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { IconBooks, IconPuzzle, IconWorld } from "@tabler/icons-react";
import { OykAlert, OykButton } from "@/components/ui";
import { ApiError } from "@/services/api";
import { useAuth } from "@/services/auth";
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
  password: "",
};

export default function Login() {
  const { t } = useTranslation();
  const { n, routeTitle } = useRouter();
  const { login, isAuth, isLoading } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    routeTitle(t("auth.login.title"));
  }, [routeTitle, t]);

  useEffect(() => {
    if (!isLoading && isAuth) {
      n("dashboard");
    }
  }, [isAuth, isLoading, n]);

  const updateField = <K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const username = form.username.trim();
    if (!username || !form.password) {
      setError(t("auth.login.error.required"));
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, form.password);
      n("dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t("auth.login.error.generic"));
      } else {
        setError(t("auth.login.error.generic"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="oyk-register">
      <section className="oyk-register-form-panel" aria-labelledby="oyk-login-title">
        <div className="oyk-register-form-inner">
          <p className="oyk-register-brand">{t("auth.login.brand")}</p>
          <h1 id="oyk-login-title" className="oyk-register-title">
            {t("auth.login.title")}
          </h1>
          <p className="oyk-register-subline">{t("auth.login.subline")}</p>

          {error && (
            <OykAlert
              key={error}
              type="danger"
              title={t("auth.login.error.title")}
              message={error}
              closable
              onClose={() => setError(null)}
              className="oyk-register-alert"
            />
          )}

          <form className="oyk-register-form" onSubmit={handleSubmit} noValidate>
            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-login-username">
                {t("auth.login.username")}
              </label>
              <input
                id="oyk-login-username"
                className="oyk-register-input"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                disabled={isSubmitting}
                onChange={(event) => updateField("username", event.target.value)}
              />
            </div>

            <div className="oyk-register-field">
              <label className="oyk-register-label" htmlFor="oyk-login-password">
                {t("auth.login.password")}
              </label>
              <input
                id="oyk-login-password"
                className="oyk-register-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                disabled={isSubmitting}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>

            <div className="oyk-register-actions">
              <OykButton label={t("auth.login.submit")} disabled={isSubmitting} />
            </div>
          </form>

          <p className="oyk-register-login">
            <span>{t("auth.login.noAccount")}</span>
            <button type="button" className="oyk-register-login-link" onClick={() => n("register")}>
              {t("auth.login.register")}
            </button>
          </p>
        </div>
      </section>

      <aside className="oyk-register-aside-panel" aria-labelledby="oyk-login-aside-title">
        <div className="oyk-register-aside-atmosphere" aria-hidden="true">
          <img className="oyk-register-aside-atmosphere-img" src={ImgAsideAtmosphere} alt="" decoding="async" />
          <div className="oyk-register-aside-atmosphere-veil" />
          <div className="oyk-register-aside-glow" />
        </div>

        <div className="oyk-register-aside-inner">
          <p className="oyk-register-aside-kicker">{t("auth.login.aside.kicker")}</p>
          <h2 id="oyk-login-aside-title" className="oyk-register-aside-title">
            {t("auth.login.aside.title")}
          </h2>
          <p className="oyk-register-aside-subline">{t("auth.login.aside.subline")}</p>

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
                <h3 className="oyk-register-feature-title">{t(`auth.login.aside.${key}.title`)}</h3>
                <p className="oyk-register-feature-body">{t(`auth.login.aside.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
