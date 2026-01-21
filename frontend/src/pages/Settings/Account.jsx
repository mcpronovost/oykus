import { useEffect, useRef, useState } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykLoading,
} from "@/components/ui";

export default function SettingsAccount() {
  const { currentUser } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialAccountForm, setInitialAccountForm] = useState({
    username: "",
    email: "",
  });
  const [accountForm, setAccountForm] = useState(initialAccountForm);

  const fetchAccountData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const result = await api.get("/auth/me/account/", { signal });
      if (!result.success || !result.account) throw Error();
      setInitialAccountForm((prev) => ({
        ...prev,
        username: result.account.username,
        email: result.account.email,
      }));
      setAccountForm((prev) => ({
        ...prev,
        username: result.account.username,
        email: result.account.email,
      }));
    } catch (e) {
      // Ignore abort errors
      if (e?.name === "AbortError") return;
      setHasError({
        form: t("An error occurred"),
      });
    } finally {
      // Avoid state update after unmount
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({
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

  const handleReset = async () => {
    setAccountForm({
      username: initialAccountForm.username,
      email: initialAccountForm.email,
    });
    usernameRef.current.value = initialAccountForm.username || "";
    emailRef.current.value = initialAccountForm.email || "";
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Account")}`);

    fetchAccountData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-profile">
      {hasError?.form ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={t(
              "Unable to access account data, check your internet connection or try again later"
            )}
            variant="danger"
          />
        </OykCard>
      ) : (
        <OykCard>
          {isLoading ? (
            <OykLoading />
          ) : (
            <OykForm className="oyk-settings-form" isLoading={isLoading}>
              <h2 className="oyk-settings-form-title">{t("Your Account")}</h2>
              <OykFormField
                ref={usernameRef}
                label={t("Username")}
                name="username"
                defaultValue={accountForm.username}
                onChange={handleChange}
                hasError={hasError?.fields?.username}
                required
              />
              {hasError?.username && (
                <OykFormMessage hasError={hasError?.username} />
              )}
              <OykFormField
                ref={emailRef}
                label={t("Email")}
                name="email"
                defaultValue={accountForm.email}
                onChange={handleChange}
                hasError={hasError?.fields?.email}
                required
              />
              {hasError?.email && <OykFormMessage hasError={hasError?.email} />}
              <div className="oyk-form-actions">
                <OykButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || isSubmitLoading}
                >
                  {isSubmitLoading ? t("Saving...") : t("Save")}
                </OykButton>
                <OykButton
                  type="reset"
                  disabled={isLoading || isSubmitLoading}
                  outline
                  action={handleReset}
                >
                  {t("Cancel")}
                </OykButton>
              </div>
            </OykForm>
          )}
        </OykCard>
      )}
    </section>
  );
}
