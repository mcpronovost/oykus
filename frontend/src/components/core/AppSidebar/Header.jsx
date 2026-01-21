import { useRef } from "react";
import { SquircleDashed  } from "lucide-react";
import { useStore } from "@/services/store";
import { OykLink, OykDropdown } from "@/components/ui";

export default function Header() {
  const { currentUser } = useStore();

  const dropdownRef = useRef(null);

  return (
    <header className="oyk-app-sidebar-header">
      <OykDropdown
        ref={dropdownRef}
        toggle={
          <OykLink routeName="home" className="oyk-app-sidebar-header-button">
            <span className="oyk-app-sidebar-header-button-logo">
              <SquircleDashed  size={18} color="var(--oyk-c-primary-fg)" />
            </span>
            <span className="oyk-app-sidebar-header-button-brand">Oykus</span>
          </OykLink>
        }
        direction="full"
        disabled={!currentUser}
      />
    </header>
  );
}
