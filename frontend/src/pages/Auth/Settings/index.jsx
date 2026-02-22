import "@/assets/styles/page/_settings.scss";
import { CircleUser, Cog, Construction } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridNav, OykGridMain, OykHeading } from "@/components/ui";
import { OykSidenav } from "@/components/common";
import OykError404 from "@/pages/Error404";
import OykSettingsProfile from "./Profile";
import OykSettingsAccount from "./Account";
import OykSettingsAccountPreferences from "./AccountPreferences";

export default function Settings() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Profile"),
      description: t("Change your avatar and cover images, your name, and more"),
      Icon: CircleUser,
      links: [
        {
          name: t("General"),
          routeName: "settings-profile",
        },
      ],
    },
    {
      title: t("Account"),
      description: t("Change settings, configure notifications, and more"),
      Icon: Cog,
      links: [
        {
          name: t("General"),
          routeName: "settings-account",
        },
        {
          name: t("Change Password"),
          routeName: "settings-account-password",
          disabled: true,
        },
        {
          name: t("Preferences"),
          routeName: "settings-account-preferences",
        },
        {
          name: t("Limitations"),
          routeName: "settings-account-limitations",
          disabled: true,
        },
      ],
    },
  ];

  if (!isAuth) {
    return <OykError404 />;
  }

  return (
    <section className="oyk-page oyk-settings">
      <OykHeading title={t("Settings")} />
      <OykGrid>
        <OykGridRow>
          <OykGridNav className="oyk-settings-grid-nav">
            <OykSidenav menu={menu} />
          </OykGridNav>
          <OykGridMain>
            {params?.section === "profile" ? (
              <OykSettingsProfile />
            ) : params?.section === "account" ? (
              <OykSettingsAccount />
            ) : params?.section === "account-preferences"? (
              <OykSettingsAccountPreferences />
            ) : (
              <OykCard>
                <OykFeedback
                  ghost
                  variant="warning"
                  title={t("Under Construction")}
                  message={t("These settings are currently in development and should be available soon")}
                  icon={Construction}
                />
              </OykCard>
            )}
          </OykGridMain>
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
