import type { TypeEncyclopediaEntry } from "@/services/api";
import { getIcon } from "@/utils";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDrawer } from "@/components/ui";

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
      headerIcon={getIcon(entry?.topic?.icon)}
      headerColor={entry?.topic?.color ?? "default"}
      content={<pre>{JSON.stringify(entry, null, 2)}</pre>}
      actions={<OykButton label={t("Edit Entry")} color="accent" onClick={() => {}} />}
    />
  );
}
