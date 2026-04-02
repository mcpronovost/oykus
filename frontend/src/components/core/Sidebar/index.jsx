import { Backpack, Flame, SquareUserRound } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykAvatar, OykLink, OykScrollbar } from "@/components/ui";

export default function OykCoreSidebar() {
  const { isAuth } = useAuth();
  const { storeCoreGamebarOpen } = useStore();
  const { t } = useTranslation();
  const { universes, currentUniverse, currentCharacter } = useWorld();

  return (
    <aside id="oyk-core-sidebar">
      <OykScrollbar height="100%" className="oyk-core-sidebar-scrollbar">
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
          {universes?.length > 0 && universes.map((u) => {
            if (u.slug === "oykus") return null;
            return (
              <OykLink key={u.slug} routeName="universe" params={{ universeSlug: u.slug }}>
                <OykAvatar src={u.logo} size={40} />
              </OykLink>
            )
          })}
        </section>
      </OykScrollbar>
    </aside>
  );
}
