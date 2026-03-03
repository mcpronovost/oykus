import { useMemo } from "react";
import { Menu } from "lucide-react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykDropdown, OykLink } from "@/components/ui";

export default function AppHeaderMenu() {
  const { n } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const menuList = useMemo(() => {
    if (currentUniverse && currentUniverse.slug === "test") {
      return [
        {
          label: t("About"),
          routeName: "about",
          onClick: () => n("about"),
        },
        {
          label: t("Devlog"),
          routeName: "devlog",
          onClick: () => n("devlog"),
        },
        {
          label: t("Privacy Policy"),
          routeName: "privacy-policy",
          onClick: () => n("privacy-policy"),
        },
      ];
    }
    return [
      ...(currentUniverse?.modules?.blog?.active ? [{
        label: currentUniverse.modules.blog.settings.display_name || t("Blog"),
        routeName: "blog",
        params: { universeSlug: currentUniverse.slug }
      }] : []),
      ...(currentUniverse?.modules?.planner?.active ? [{
        label: currentUniverse.modules.planner.settings.display_name || t("Planner"),
        routeName: "planner",
        params: { universeSlug: currentUniverse.slug }
      }] : []),
      ...(currentUniverse?.modules?.rewards?.active ? [{
        label: currentUniverse.modules.rewards.settings.display_name || t("Rewards"),
        routeName: "rewards",
        params: { universeSlug: currentUniverse.slug }
      }] : []),
      ...(currentUniverse?.modules?.collections?.active ? [{
        label: currentUniverse.modules.collections.settings.display_name || t("Collections"),
        routeName: "collections",
        params: { universeSlug: currentUniverse.slug }
      }] : []),
    ];
  }, [currentUniverse]);

  return (
    <section className="oyk-app-header-menu">
      <div className="oyk-app-header-menu-mobile">
        <OykDropdown
          toggle={
            <OykButton className="oyk-app-header-menu-mobile-toggle" plain style={{ padding: 0 }}>
              <Menu size={24} />
            </OykButton>
          }
          menu={menuList}
          direction="right"
        />
      </div>
      <nav className="oyk-app-header-menu-nav">
        <ul className="oyk-app-header-menu-nav-list">
          {menuList.map((item) => (
            <li key={item.label} className="oyk-app-header-menu-nav-item">
              <OykLink routeName={item.routeName} params={item.params} className="oyk-app-header-menu-nav-item-link">
                {item.label}
              </OykLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
