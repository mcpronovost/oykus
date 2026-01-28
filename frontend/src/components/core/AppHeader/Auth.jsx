import { LogIn } from "lucide-react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton } from "@/components/ui";

export default function AppBarAuth() {
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-app-bar-auth">
      <OykButton
        className="oyk-app-bar-user-button"
        onClick={() => n("login")}
        plain
        style={{
          padding: "0 8px",
        }}
      >
        <span className="oyk-app-bar-user-button-name">{t("Sign In")}</span>
        <LogIn size={18} />
      </OykButton>
    </section>
  );
}