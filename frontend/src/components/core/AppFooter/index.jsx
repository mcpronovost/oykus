import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykLink } from "@/components/ui";

export default function AppFooter() {
  const { currentUniverse, universes } = useAuth();
  const { n } = useRouter();
  const { t } = useTranslation();

  const menuList = [
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
      {currentUniverse ? (
        <small className="oyk-app-footer-small">
          <p className="oyk-app-footer-small-copyright">
            <span>{currentUniverse.name}</span> &copy;{" "}
            <time dateTime={currentUniverse.created_at.slice(0, 10)}>{currentUniverse.created_at.slice(0, 4)}</time>{" "}
            <span>{currentUniverse.staff.owner.name}</span>
          </p>
          {!currentUniverse.is_default && universes?.length > 0 ? (
            <p className="oyk-app-footer-small-copyright">
              <span>{universes[0].name}</span> &copy;{" "}
              <time dateTime={new Date().getFullYear()}>{new Date().getFullYear()}</time>{" "}
              <span>{universes[0].staff.owner.name}</span>
            </p>
          ) : null}
        </small>
      ) : null}
    </footer>
  );
}
