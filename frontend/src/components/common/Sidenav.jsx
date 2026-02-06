import { useRouter } from "@/services/router";
import { OykLink } from "@/components/ui";

export default function OykSidenav({ menu = []}) {
  const { params } = useRouter();

  if (!menu || menu.length <= 0) {
    return null;
  }

  return (
    <nav className="oyk-sidenav">
      <ul>
        {menu.map((m, index) => (
          <li key={index} className={`oyk-sidenav-item ${index <= 0 ? "oyk-first" : ""}`}>
            <header className="oyk-sidenav-header">
              <span className="oyk-sidenav-header-icon">
                <m.Icon size={24} color={"var(--oyk-c-primary)"} />
              </span>
              <span className="oyk-sidenav-header-title">
                <span className="oyk-sidenav-header-title-name">{m.title}</span>
                <small className="oyk-sidenav-header-title-desc">{m.description}</small>
              </span>
            </header>
            <ul className="oyk-sidenav-menu">
              {m.links.map((l, li) => (
                <li key={li} className="oyk-sidenav-menu-item">
                  <OykLink
                    routeName={l.routeName}
                    params={l.params}
                    className={`oyk-sidenav-menu-item-link ${l.routeName.endsWith(params?.section) ? "oyk-active" : ""}`}
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
  );
}
