import { useEffect, useMemo, useRef, useState } from "react";
import { SquircleDashed } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykLink, OykDropdown } from "@/components/ui";
import imgOykus from "@/assets/img/oykus-32.webp";

export default function Header() {
  const { isAuth, isDev, universes } = useAuth();
  const { refresh, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);

  const dropdownRef = useRef(null);

  const handleUniverseClick = (uId) => {
    console.log(uId);
    // setCurrentUniverse(uId);
    dropdownRef.current?.close();
    // refresh();
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Manage Friends")}`);

    // fetchUniversesData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  const universesMenu = useMemo(
    () =>
      isAuth && universes?.length > 0
        ? [
            ...universes.map((u) => ({
              label: u.name,
              element: (
                <button
                  className="oyk-app-sidebar-header-button-dropdown-item"
                  onClick={() => handleUniverseClick(u.slug)}
                >
                  <span className="oyk-app-sidebar-header-button-dropdown-item-logo">
                    {u.logo ? (
                      <img src={imgOykus} width={32} height={32} alt={u.name} />
                    ) : (
                      <SquircleDashed size={24} color={u.c_primary ? u.c_primary : "var(--oyk-default-primary)"} />
                    )}
                  </span>
                  <span className="oyk-app-sidebar-header-button-dropdown-item-brand">{u.name}</span>
                </button>
              ),
            })),
          ]
        : [],
    [isAuth, universes],
  );

  return (
    <header className="oyk-app-sidebar-header">
      <OykDropdown
        ref={dropdownRef}
        toggle={
          <OykLink routeName="home" className="oyk-app-sidebar-header-button">
            <span className="oyk-app-sidebar-header-button-logo">
              <img src={imgOykus} width={32} height={32} alt="Oykus" />
            </span>
            <span className="oyk-app-sidebar-header-button-brand">Oykus</span>
          </OykLink>
        }
        menu={universesMenu}
        direction="full"
        disabled={!isAuth}
      />
    </header>
  );
}
