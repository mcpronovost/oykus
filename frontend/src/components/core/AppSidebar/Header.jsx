import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Leaf, Stone } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykLink, OykDropdown } from "@/components/ui";
import imgOykus from "@/assets/img/oykus-32.webp";

export default function Header() {
  const { isAuth, isDev } = useAuth();
  const { refresh, routeTitle } = useRouter();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [universes, setUniverses] = useState([]);

  const dropdownRef = useRef(null);

  const handleUniverseClick = (world) => {
    // setCurrentWorld(world);
    dropdownRef.current?.close();
    refresh();
  };
  
  const fetchUniversesData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    console.log("fetchUniversesData");
    try {
      const r = await api.get("/game/universes/", signal ? { signal } : {});
      if (!r.ok || !r.universes) throw Error();
      setUniverses(r.universes);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        fetch: t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Manage Friends")}`);

    fetchUniversesData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  const universesMenu = useMemo(() => (
    isDev ? [
      {
        label: "Oykus",
        element: (
          <button className="oyk-app-sidebar-header-button-dropdown-item" onClick={() => handleUniverseClick()}>
            <span
              className="oyk-app-sidebar-header-button-dropdown-item-logo"
              style={{ backgroundColor: "var(--oyk-default-primary)" }}
            >
              <img src={imgOykus} width={32} height={32} alt="Oykus" />
            </span>
            <span className="oyk-app-sidebar-header-button-dropdown-item-brand">Oykus</span>
          </button>
        ),
      },
      {
        label: "Edenwood",
        element: (
          <button className="oyk-app-sidebar-header-button-dropdown-item" onClick={() => handleUniverseClick()}>
            <span
              className="oyk-app-sidebar-header-button-dropdown-item-logo"
              style={{ backgroundColor: "#0e1a14" }}
            >
              <Leaf size={18} color="#2a6b52" />
            </span>
            <span className="oyk-app-sidebar-header-button-dropdown-item-brand">Edenwood</span>
          </button>
        ),
      },
      {
        label: "Qalatlán",
        element: (
          <button className="oyk-app-sidebar-header-button-dropdown-item" onClick={() => handleUniverseClick()}>
            <span
              className="oyk-app-sidebar-header-button-dropdown-item-logo"
              style={{ backgroundColor: "#2d2a23" }}
            >
              <Flame size={18} color="#dea125" />
            </span>
            <span className="oyk-app-sidebar-header-button-dropdown-item-brand">Qalatlán</span>
          </button>
        ),
      },
      {
        label: "Rhansidor",
        element: (
          <button className="oyk-app-sidebar-header-button-dropdown-item" onClick={() => handleUniverseClick()}>
            <span
              className="oyk-app-sidebar-header-button-dropdown-item-logo"
              style={{ backgroundColor: "#2a1f27" }}
            >
              <Stone size={18} color="#9e4092" />
            </span>
            <span className="oyk-app-sidebar-header-button-dropdown-item-brand">Rhansidor</span>
          </button>
        ),
      }
    ] : []
  ), [isAuth]);

  return (
    <header className="oyk-app-sidebar-header">
      <OykDropdown
        ref={dropdownRef}
        toggle={
          <OykLink routeName="home" className="oyk-app-sidebar-header-button" disabled>
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
