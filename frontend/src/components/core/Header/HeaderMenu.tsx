import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { oykClass } from "@/utils";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykDialog, OykLink } from "@/components/ui";

type HeaderMenuItem = {
  routeName: string;
  label: string;
};

const MENUS: HeaderMenuItem[][] = [
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

function getVisibleMenuCount(
  availableWidth: number,
  itemWidths: number[],
  moreWidth: number,
  gap: number,
) {
  if (itemWidths.length === 0 || availableWidth <= 0) return 0;

  const totalWidth =
    itemWidths.reduce((sum, width) => sum + width, 0) +
    gap * Math.max(itemWidths.length - 1, 0);

  if (totalWidth <= availableWidth) return itemWidths.length;

  for (let visibleCount = itemWidths.length - 1; visibleCount >= 0; visibleCount -= 1) {
    const visibleWidth = itemWidths
      .slice(0, visibleCount)
      .reduce((sum, width) => sum + width, 0);
    const gaps = gap * visibleCount;
    const needed = visibleWidth + gaps + moreWidth;
    if (needed <= availableWidth) return visibleCount;
  }

  return 0;
}

function HeaderMenuLink({
  item,
  active,
  onNavigate,
  className,
}: {
  item: HeaderMenuItem;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <OykLink
      routeName={item.routeName}
      className={oykClass(className, active && "oyk-active")}
      onClick={onNavigate}
    >
      {item.label}
    </OykLink>
  );
}

export default function OykCoreHeaderMenu() {
  const { route } = useRouter();
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const items =
    MENUS.find((menu) => menu.some((link) => link.routeName === route?.name)) ?? [];
  const itemsKey = items.map((item) => item.routeName).join("|");

  useLayoutEffect(() => {
    setVisibleCount(null);
    setOverflowOpen(false);
  }, [itemsKey]);

  useLayoutEffect(() => {
    const navEl = navRef.current;
    const measureEl = measureRef.current;
    if (!navEl || !measureEl || items.length === 0) return;

    const updateVisibleCount = () => {
      const itemEls = Array.from(
        measureEl.querySelectorAll<HTMLElement>("[data-header-menu-measure-item]"),
      );
      const moreEl = measureEl.querySelector<HTMLElement>(
        "[data-header-menu-measure-more]",
      );
      if (itemEls.length === 0 || !moreEl) return;

      const styles = getComputedStyle(measureEl);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const itemWidths = itemEls.map((itemEl) => itemEl.offsetWidth);
      const moreWidth = moreEl.offsetWidth;

      setVisibleCount(
        getVisibleMenuCount(navEl.clientWidth, itemWidths, moreWidth, gap),
      );
    };

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(navEl);
    return () => resizeObserver.disconnect();
  }, [itemsKey, items.length]);

  const resolvedVisibleCount = visibleCount ?? items.length;
  const visibleItems = items.slice(0, resolvedVisibleCount);
  const overflowItems = items.slice(resolvedVisibleCount);
  const hasOverflow = overflowItems.length > 0;

  useEffect(() => {
    if (!hasOverflow) setOverflowOpen(false);
  }, [hasOverflow]);

  if (items.length === 0) return null;

  return (
    <nav ref={navRef} className="oyk-core-header-menu">
      <ul
        ref={measureRef}
        className="oyk-core-header-menu-measure"
        aria-hidden="true"
      >
        {items.map((item) => (
          <li
            key={item.routeName}
            className="oyk-core-header-menu-item"
            data-header-menu-measure-item
          >
            <span className="oyk-core-header-menu-link">{item.label}</span>
          </li>
        ))}
        <li
          className="oyk-core-header-menu-item"
          data-header-menu-measure-more
        >
          <span className="oyk-core-header-menu-more">
            <IconDots size={20} stroke={1.5} />
          </span>
        </li>
      </ul>

      <ul className="oyk-core-header-menu-list">
        {visibleItems.map((item) => (
          <li key={item.routeName} className="oyk-core-header-menu-item">
            <HeaderMenuLink
              item={item}
              active={Boolean(route?.name && route.name === item.routeName)}
              className="oyk-core-header-menu-link"
            />
          </li>
        ))}
        {hasOverflow && (
          <li className="oyk-core-header-menu-item">
            <OykDialog
              className={oykClass(
                "oyk-core-header-menu-more",
                overflowOpen && "oyk-open",
              )}
              placement="bottom"
              offset={0}
              open={overflowOpen}
              onOpenChange={setOverflowOpen}
              role="button"
              tabIndex={0}
              aria-label={t("More")}
              aria-haspopup="menu"
              aria-expanded={overflowOpen}
              content={({ close }) => (
                <ul className="oyk-core-header-menu-overflow" role="menu">
                  {overflowItems.map((item) => (
                    <li key={item.routeName} role="none">
                      <HeaderMenuLink
                        item={item}
                        active={Boolean(
                          route?.name && route.name === item.routeName,
                        )}
                        className="oyk-core-header-menu-overflow-link"
                        onNavigate={close}
                      />
                    </li>
                  ))}
                </ul>
              )}
            >
              <IconDots size={20} stroke={1.5} />
            </OykDialog>
          </li>
        )}
      </ul>
    </nav>
  );
}
