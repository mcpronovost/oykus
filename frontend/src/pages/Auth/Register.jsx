import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { validateUsername, validatePassword, validateEmail, validateName } from "@/utils";
import { OykButton, OykCard, OykForm, OykFormField, OykFormMessage, OykLink } from "@/components/ui";

export default function Register() {
  const { n, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccess, setHasSuccess] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Fields validation
    const usernameError = validateUsername(registerForm.username);
    const passwordError = validatePassword(registerForm.password);
    const emailError = validateEmail(registerForm.email);
    const nameError = validateName(registerForm.name);

    usernameError && (newErrors.username = usernameError);
    passwordError && (newErrors.password = passwordError);
    emailError && (newErrors.email = emailError);
    nameError && (newErrors.name = nameError);

    // Confirm password validation
    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setHasError({ fields: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (hasError?.fields?.[name]) {
      setHasError((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [name]: "",
        },
      }));
    }
  };

  const postSubmit = async () => {
    setIsLoading(true);
    setHasError(null);
    setHasSuccess(null);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", registerForm.username);
      formData.append("password", registerForm.password);
      formData.append("confirmPassword", registerForm.confirmPassword);
      formData.append("email", registerForm.email);
      formData.append("name", registerForm.name);
      const r = await api.post("/auth/register/", formData);
      if (!r.ok) throw r;
      setHasSuccess(() => ({
        title: t("Account created"),
        message: t("You can now log in")
      }));
      n("login");
    } catch (e) {
      if (e?.fields) {
        setHasError(() => ({
          fields: t(e.fields)
        }));
      } else {
        setHasError(() => ({
          message: t(e?.error) || t("An error occurred")
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };
    
  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Register"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-auth">
      <div className="oyk-auth-container">
        <div className="oyk-auth-header">
          <h1 className="oyk-auth-header-title">{t("Create an account")}</h1>
          <p className="oyk-auth-header-subtitle">
            {t("Or")}{" "}
            <OykLink routeName="login" className="oyk-auth-header-subtitle">
              {t("sign in to an existing account")}
            </OykLink>
          </p>
        </div>
        <OykCard>
          <OykForm className="oyk-auth-form" onSubmit={postSubmit} isLoading={isLoading}>
            <OykFormField
              label={t("Username")}
              name="username"
              defaultValue={registerForm.username}
              onChange={handleChange}
              hasError={hasError?.fields?.username}
              required
              block
            />
            <OykFormField
              label={t("Password")}
              name="password"
              type="password"
              defaultValue={registerForm.password}
              onChange={handleChange}
              hasError={hasError?.fields?.password}
              required
              block
            />
            <OykFormField
              label={t("Confirm Password")}
              name="confirmPassword"
              type="password"
              defaultValue={registerForm.confirmPassword}
              onChange={handleChange}
              hasError={hasError?.fields?.confirmPassword}
              required
              block
            />
            <OykFormField
              label={t("Email")}
              name="email"
              type="email"
              defaultValue={registerForm.email}
              onChange={handleChange}
              hasError={hasError?.fields?.email}
              required
              block
            />
            <OykFormField
              label={t("Name")}
              name="name"
              defaultValue={registerForm.name}
              onChange={handleChange}
              hasError={hasError?.fields?.name}
              required
              block
            />
            {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
            {hasSuccess?.message && <OykFormMessage successTitle={hasSuccess?.title} hasSuccess={hasSuccess?.message} />}
            <div className="oyk-form-actions">
              <OykButton type="submit" color="primary" disabled={isLoading} block>
                {isLoading ? t("Creating account...") : t("Create account")}
              </OykButton>
            </div>
          </OykForm>
        </OykCard>
      </div>
    </section>
  );
}