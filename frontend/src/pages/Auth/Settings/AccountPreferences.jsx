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
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function SettingsAccountPreferences() {
  const { currentUser, setUser } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialAccountForm, setInitialAccountForm] = useState({
    timezone: "",
  });
  const [accountForm, setAccountForm] = useState(initialAccountForm);

  const fetchAccountData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/auth/me/account/", signal ? { signal } : {});
      if (!r.ok || !r.account) throw Error();
      const payload = {
        timezone: r.account.timezone,
      };
      setInitialAccountForm((prev) => ({
        ...prev,
        ...payload,
      }));
      setAccountForm((prev) => ({
        ...prev,
        ...payload,
      }));
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        form: t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const postSubmit = async () => {
    setIsSubmitLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("timezone", accountForm.timezone);
      const r = await api.post("/auth/me/account/edit/", formData);
      if (!r?.ok) throw new Error(r.error || t("An error occurred"));
      setUser({
        ...currentUser,
        timezone: accountForm.timezone,
      });
    } catch (e) {
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      setIsSubmitLoading(false);
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

    routeTitle(`${t("Settings")} - ${t("Preferences")}`);

    fetchAccountData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-profile">
      <OykHeading subtitle tag="h2" title={t("Preferences")} nop />
      {hasError?.form ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={t(
              "Unable to access preferences data, check your internet connection or try again later"
            )}
            variant="danger"
          />
        </OykCard>
      ) : (
        <OykCard>
          {isLoading ? (
            <OykLoading />
          ) : (
            <OykForm className="oyk-settings-form" isLoading={isSubmitLoading} onSubmit={postSubmit}>
              <OykFormField
                label={t("Timezone")}
                name="timezone"
                type="select"
                defaultValue={accountForm.timezone}
                options={[
                  { label: "UTC", value: "UTC" },
                  { label: "America/Toronto", value: "America/Toronto" },
                  { label: "America/New_York", value: "America/New_York" },
                  { label: "Europe/London", value: "Europe/London" },
                  { label: "Europe/Paris", value: "Europe/Paris" },
                  { label: "Europe/Berlin", value: "Europe/Berlin" },
                ]}
                onChange={handleChange}
                hasError={hasError?.timezone}
                required
              />
              {hasError?.message && (
                <OykFormMessage hasError={hasError?.message} />
              )}
              <div className="oyk-form-actions">
                <OykButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || isSubmitLoading}
                  isLoading={isSubmitLoading}
                >
                  {t("Save")}
                </OykButton>
                <OykButton
                  type="reset"
                  disabled={isLoading || isSubmitLoading}
                  outline
                  onClick={handleReset}
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
