import { useMemo, useRef } from "react";
import { SquircleDashed } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { OykAvatar, OykDropdown } from "@/components/ui";
import imgOykus from "@/assets/img/oykus-32.webp";

export default function Header() {
  const { isAuth, universes, currentUniverse, setCurrentUniverse } = useAuth();
  const { n } = useRouter();

  const dropdownRef = useRef(null);

  const handleUniverseClick = (uSlug) => {
    setCurrentUniverse(uSlug);
    dropdownRef.current?.close();
    n("home");
  };

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
                      <OykAvatar src={u.logo} size={32} name={u.name} borderSize={0} />
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
          <div className="oyk-app-sidebar-header-button">
            <span className="oyk-app-sidebar-header-button-logo">
              {!currentUniverse ? (
                <OykAvatar src={imgOykus} size={32} name="Oykus" />
              ) : currentUniverse.logo ? (
                <OykAvatar src={currentUniverse.logo} size={32} name={currentUniverse.name} />
              ) : (
                <SquircleDashed size={24} color="var(--oyk-c-primary)" />
              )}
            </span>
            <span className="oyk-app-sidebar-header-button-brand">{currentUniverse?.name || "Oykus"}</span>
          </div>
        }
        menu={universesMenu}
        direction="full"
        disabled={!isAuth}
      />
    </header>
  );
}
