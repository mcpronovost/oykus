import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useAuth } from "@/services/auth"
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDropdown, OykLink } from "@/components/ui";;

export default function AppFooter() {
  const { isAuth } = useAuth();
  const { n } = useRouter();
  const { t } = useTranslation();

  const menuList = [
    {
      label: t("About"),
      routeName: "about",
      onClick:() => n("about"),
    },
    {
      label: t("Devlog"),
      routeName: "devlog",
      onClick: () => n("devlog")
    },
    {
      label: t("Privacy Policy"),
      routeName: "privacy-policy",
      onClick: () => n("privacy-policy"),
    },
  ];

  return (
    <footer className="oyk-app-footer">
      <nav className="oyk-app-footer-nav">
        <ul className="oyk-app-footer-nav-list">
          {menuList.map((item) => (
            <li key={item.label} className="oyk-app-footer-nav-item">
              <OykLink routeName={item.routeName} className="oyk-app-footer-nav-item-link">
                {item.label}
              </OykLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
