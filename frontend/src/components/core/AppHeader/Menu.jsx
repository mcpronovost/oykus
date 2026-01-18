import { Menu } from "lucide-react";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDropdown, OykLink } from "@/components/common";

export default function AppHeaderMenu() {
  const { n } = useRouter();
  const { t } = useTranslation();

  const menuList = [
    {
      label: t("About"),
      routeName: "about",
      onClick:() => n("about"),
    },
    {
      label: t("Privacy Policy"),
      routeName: "privacy-policy",
      onClick: () => n("privacy-policy"),
    },
  ];

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
              <OykLink routeName={item.routeName} className="oyk-app-header-menu-nav-item-link">
                {item.label}
              </OykLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
