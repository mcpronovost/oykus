import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton } from "@/components/common";

export default function AppBarAuth() {
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-app-bar-auth">
      <OykButton
        className="oyk-app-bar-user-button"
        action={() => n("login")}
        plain
        style={{
          padding: "0",
        }}
      >
        <span className="oyk-app-bar-user-button-name">{t("Sign In")}</span>
        <OykAvatar size={36} />
      </OykButton>
    </section>
  );
}