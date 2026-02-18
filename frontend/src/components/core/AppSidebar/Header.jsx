import { useMemo, useRef } from "react";
import { SquircleDashed } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useWorld } from "@/services/world";

import { OykAvatar, OykDropdown } from "@/components/ui";
import imgOykus from "@/assets/img/oykus-32.webp";

export default function Header() {
  const { isAuth } = useAuth();
  const { n } = useRouter();
  const { universes, currentUniverse, changeUniverse } = useWorld();

  const dropdownRef = useRef(null);

  const handleUniverseClick = (uSlug) => {
    dropdownRef.current?.close();
    n("universe", { universeSlug: uSlug });
    changeUniverse(uSlug);
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
                      <OykAvatar src={u.logo} size={32} name={u.name} borderColor="transparent" borderRadius="6px" borderSize={0} />
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
                <OykAvatar src={imgOykus} size={32} name="Oykus" borderColor="transparent" borderRadius="6px" borderSize={0} isPrivate={false} />
              ) : currentUniverse.logo ? (
                <OykAvatar src={currentUniverse.logo} size={32} name={currentUniverse.name} borderColor="transparent" borderRadius="6px" borderSize={0} />
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
        bgColor="var(--oyk-app-header-bg)"
        fgColor="var(--oyk-app-header-fg)"
        bgSubtleColor="var(--oyk-app-header-subtle-bg)"
        fgSubtleColor="var(--oyk-app-header-subtle-fg)"
      />
    </header>
  );
}
