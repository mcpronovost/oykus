import { useMemo, useRef } from "react";
import { SquircleDashed  } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { OykLink, OykDropdown } from "@/components/ui";
import imgOykus from "@/assets/img/oykus-32.webp";

export default function Header() {
  const { isAuth } = useAuth();
  const { refresh } = useRouter();

  const dropdownRef = useRef(null);

  const handleUniverseClick = (world) => {
    // setCurrentWorld(world);
    dropdownRef.current?.close();
    refresh();
  };

  const universesMenu = useMemo(() => (
    [
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
      }
    ]
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
