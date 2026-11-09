import { oykClass } from "@/utils";
import { useRouter } from "@/services/router";
import { OykLink } from "@/components/ui";

const MENUS = [
  [
    { routeName: "dashboard", label: "Dashboard" },
    { routeName: "goals", label: "Goals" },
  ],
  [
    { routeName: "encyclopedia", label: "Browse" },
    { routeName: "characters", label: "Characters" },
    { routeName: "locations", label: "Locations" },
    { routeName: "events", label: "Events" },
    { routeName: "quests", label: "Quests" },
  ],
  [{ routeName: "notes", label: "Notes" }],
];

export default function OykCoreHeaderMenu() {
  const { route } = useRouter();

  const items =
    MENUS.find((m) => m.some((l) => l.routeName === route?.name)) ?? [];

  if (items.length === 0) return null;

  return (
    <nav className="oyk-core-header-menu">
      <ul className="oyk-core-header-menu-list">
        {items.map((item) => (
          <li key={item.routeName} className="oyk-core-header-menu-item">
            <OykLink
              routeName={item.routeName}
              className={oykClass(
                "oyk-core-header-menu-link",
                route?.name && route?.name === item.routeName && "oyk-active",
              )}
            >
              {item.label}
            </OykLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
