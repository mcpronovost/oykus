import { useEffect, useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykResult } from "@/components/ui";

function clearClientCookies() {
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name) {
      document.cookie = `${name}=;expires=${expire};path=/`;
    }
  }
  document.cookie = `oyk-session=;expires=${expire};path=/`;
}

export default function OykLogout() {
  const { t } = useTranslation();
  const { n, routeTitle } = useRouter();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    routeTitle(t("auth.logout.title"));
  }, [routeTitle, t]);

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      n("login");
    } catch {
      clearClientCookies();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    void handleLogout();
  }, [handleLogout]);

  return (
    <div className="oyk-logout">
      <OykResult title={t("auth.logout.title")} message={t("auth.logout.message")} variant="ghost">
        <OykButton
          label={t("auth.logout.button")}
          start={IconLogout}
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleLogout}
        />
      </OykResult>
    </div>
  );
}
