import type { TypeEncyclopediaEntry } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykDrawer } from "@/components/ui";

interface OykEncyclopediaDrawerEntryProps {
  drawerOpen: boolean;
  setDrawerOpen: (drawerOpen: boolean) => void;
  entry: TypeEncyclopediaEntry | null;
}

export default function OykEncyclopediaDrawerEntry({
  drawerOpen,
  setDrawerOpen,
  entry,
}: OykEncyclopediaDrawerEntryProps) {
  const { t } = useTranslation();

  return (
    <OykDrawer
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      title={entry?.title}
      suptitle={`${t("Encyclopedia")} · ${t(`encyclopedia.topic.${entry?.topic?.slug}`)}`}
      content={<pre>{JSON.stringify(entry, null, 2)}</pre>}
    />
  );
}
