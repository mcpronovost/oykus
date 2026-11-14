import type { Icon } from "@tabler/icons-react";
import {
  IconCircleDashed,
  IconBooks,
  IconCrown,
  IconFlare,
  IconLeaf,
  IconMap,
  IconNews,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";

export const ICONS: Record<string, Icon> = {
  book: IconBooks,
  users: IconUsers,
  crown: IconCrown,
  map: IconMap,
  leaf: IconLeaf,
  shield: IconShield,
  flare: IconFlare,
  news: IconNews,
  circle_dashed: IconCircleDashed,
};

export const DEFAULT_ICON = IconCircleDashed;

export function getIcon(icon?: string | null): Icon {
  if (!icon) return DEFAULT_ICON;
  return ICONS[icon] ?? DEFAULT_ICON;
}
