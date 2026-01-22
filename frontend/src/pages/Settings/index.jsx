import "@/assets/styles/page/_settings.scss";
import { CircleUser, Cog, Smile, Construction } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridNav,
  OykGridMain,
  OykHeading,
  OykLink,
} from "@/components/ui";
import OykError404 from "@/pages/Error404";
import OykSettingsProfile from "./Profile";
import OykSettingsAccount from "./Account";

export default function Settings() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Profile"),
      description: t(
        "Change your avatar and cover images, your name, and more"
      ),
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
        },
        {
          name: t("Privacy"),
          routeName: "settings-account-privacy",
        },
      ],
    },
    {
      title: t("Friends"),
      description: t("Manage friends and accept invites"),
      Icon: Smile,
      links: [
        {
          name: t("Manage Friends"),
          routeName: "settings-friends",
        },
        {
          name: t("Invites"),
          routeName: "settings-friends-invites",
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
            <nav className="oyk-settings-nav">
              <ul>
                {menu.map((m, index) => (
                  <li key={index} className={`oyk-settings-nav-item ${index <= 0 ? "oyk-first": ""}`}>
                    <header className="oyk-settings-nav-header">
                      <span className="oyk-settings-nav-header-icon">
                        <m.Icon size={24} color={"var(--oyk-c-primary)"} />
                      </span>
                      <span className="oyk-settings-nav-header-title">
                        <span className="oyk-settings-nav-header-title-name">
                          {m.title}
                        </span>
                        <small className="oyk-settings-nav-header-title-desc">
                          {m.description}
                        </small>
                      </span>
                    </header>
                    <ul className="oyk-settings-nav-menu">
                      {m.links.map((l, li) => (
                        <li key={li} className="oyk-settings-nav-menu-item">
                          <OykLink
                            routeName={l.routeName}
                            className={`oyk-settings-nav-menu-item-link ${`settings-${params?.section}` === l.routeName ? "oyk-active" : ""}`}
                          >
                            {l.name}
                          </OykLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </OykGridNav>
          <OykGridMain>
            {params?.section === "profile" ? (
              <OykSettingsProfile />
            ) : params?.section === "account" ? (
              <OykSettingsAccount />
            ) : (
              <OykCard>
                <OykFeedback ghost variant="warning" title={t("Under Construction")} message={t("These settings are currently in development and should be available soon")} icon={Construction} />
              </OykCard>
            )}
          </OykGridMain>
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
