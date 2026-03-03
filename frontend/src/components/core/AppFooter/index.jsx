import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";
import { OykLink } from "@/components/ui";

export default function AppFooter() {
  const { n } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, universes } = useWorld();

  const menuList = [
    {
      label: t("About"),
      routeName: "about",
      onClick: () => n("about"),
    },
    {
      label: t("Devlog"),
      routeName: "blog",
      params: { universeSlug: "oykus"},
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
              <OykLink routeName={item.routeName} params={item.params} className="oyk-app-footer-nav-item-link">
                {item.label}
              </OykLink>
            </li>
          ))}
        </ul>
      </nav>
      {currentUniverse ? (
        <small className="oyk-app-footer-small">
          {!currentUniverse.is_default ? (
            <p className="oyk-app-footer-small-copyright">
              <span>{currentUniverse.name}</span> &copy;{" "}
              <time dateTime={currentUniverse.created_at.slice(0, 10)}>{currentUniverse.created_at.slice(0, 4)}</time>{" "}
              <span>{currentUniverse.staff.owner.name}</span>
            </p>
          ) : null}
          <p className="oyk-app-footer-small-copyright">
            <span>Oykus</span> &copy;{" "}
            <time dateTime={new Date().getFullYear()}>2022-{new Date().getFullYear()}</time>{" "}
            <span>M-C Pronovost</span>
          </p>
        </small>
      ) : null}
    </footer>
  );
}
