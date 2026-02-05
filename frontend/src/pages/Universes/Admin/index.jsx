import "@/assets/styles/page/_universes-admin.scss";
import { Orbit, Construction } from "lucide-react";

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
import OykUniverseAdminProfile from "./Profile";
import OykUniverseAdminModules from "./Modules";

export default function UniverseAdmin() {
  const { isAuth, currentUniverse } = useAuth();
  const { n, params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Profile"),
      description: t(
        "Change identity, logo, description, and more"
      ),
      Icon: Orbit,
      links: [
        {
          name: t("General"),
          routeName: "universe-admin-profile",
        },
        {
          name: t("Manage Modules"),
          routeName: "universe-admin-modules",
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
            <nav className="oyk-universes-admin-nav">
              <ul>
                {menu.map((m, index) => (
                  <li key={index} className={`oyk-universes-admin-nav-item ${index <= 0 ? "oyk-first": ""}`}>
                    <header className="oyk-universes-admin-nav-header">
                      <span className="oyk-universes-admin-nav-header-icon">
                        <m.Icon size={24} color={"var(--oyk-c-primary)"} />
                      </span>
                      <span className="oyk-universes-admin-nav-header-title">
                        <span className="oyk-universes-admin-nav-header-title-name">
                          {m.title}
                        </span>
                        <small className="oyk-universes-admin-nav-header-title-desc">
                          {m.description}
                        </small>
                      </span>
                    </header>
                    <ul className="oyk-universes-admin-nav-menu">
                      {m.links.map((l, li) => (
                        <li key={li} className="oyk-universes-admin-nav-menu-item">
                          <OykLink
                            routeName={l.routeName}
                            params={{ universeSlug: params?.universeSlug }}
                            className={`oyk-universes-admin-nav-menu-item-link ${`universe-admin-${params?.section}` === l.routeName ? "oyk-active" : ""}`}
                            disabled={l.disabled}
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
              <OykUniverseAdminProfile />
            ) : params?.section === "modules" ? (
              <OykUniverseAdminModules />
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
