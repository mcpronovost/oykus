import "@/assets/styles/page/_universes-admin.scss";
import { Orbit, Construction, Paintbrush } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridNav, OykGridMain, OykHeading } from "@/components/ui";
import { OykSidenav } from "@/components/common";
import OykError404 from "@/pages/Error404";
import OykUniverseAdminProfile from "./Profile";
import OykUniverseAdminModules from "./Modules";
import OykUniverseAdminTheme from "./Theme";
// import OykUniverseAdminThemeStylesheet from "./ThemeStylesheet";

export default function UniverseAdmin() {
  const { isAuth, currentUniverse } = useAuth();
  const { n, params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Profile"),
      description: t("Change identity, logo, description, and more"),
      Icon: Orbit,
      links: [
        {
          name: t("General"),
          routeName: "universe-admin-profile",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Manage Modules"),
          routeName: "universe-admin-modules",
          params: { universeSlug: params?.universeSlug },
        },
      ],
    },
    {
      title: t("Theme"),
      description: t("Change visual identity, colours and stylesheet"),
      Icon: Paintbrush,
      links: [
        {
          name: t("General"),
          routeName: "universe-admin-theme",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Stylesheet"),
          routeName: "universe-admin-stylesheet",
          params: { universeSlug: params?.universeSlug },
        },
      ],
    },
  ];

  if (!isAuth || !currentUniverse || currentUniverse.slug !== params?.universeSlug) {
    () => n("404");
    return <OykError404 />;
  }

  return (
    <section className="oyk-page oyk-universes-admin">
      <OykHeading title={t("Administration")} />
      <OykGrid>
        <OykGridRow>
          <OykGridNav className="oyk-universes-admin-grid-nav">
            <OykSidenav menu={menu} />
          </OykGridNav>
          <OykGridMain>
            {params?.section === "profile" ? (
              <OykUniverseAdminProfile />
            ) : params?.section === "modules" ? (
              <OykUniverseAdminModules />
            ) : params?.section === "theme" ? (
              <OykUniverseAdminTheme />
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
