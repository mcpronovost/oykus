import type { TypeEncyclopediaEntry } from "@/services/api";
import { getIcon } from "@/utils";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDrawer } from "@/components/ui";

interface OykEncyclopediaDrawerEntryProps {
  drawerOpen: boolean;
  setDrawerOpen: (drawerOpen: boolean) => void;
  entry: TypeEncyclopediaEntry | null;
  onOpenEdit?: (entry: TypeEncyclopediaEntry) => void;
}

export default function OykEncyclopediaDrawerEntry({
  drawerOpen,
  setDrawerOpen,
  entry,
  onOpenEdit,
}: OykEncyclopediaDrawerEntryProps) {
  const { t } = useTranslation();

  return (
    <OykDrawer
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      title={entry?.title ?? t("Untitled")}
      suptitle={`${t("Encyclopedia")}${entry?.topic ? ` · ${t(`encyclopedia.topic.${entry?.topic.slug}`)}` : ""}${entry?.category ? ` · ${t(`encyclopedia.category.${entry?.category.slug}`)}` : ""}`}
      headerIcon={getIcon(entry?.topic?.icon)}
      headerColor={entry?.topic?.color ?? "default"}
      content={
        <div className="oyk-page-encyclopedia-entrypreview">
          <div className="oyk-page-encyclopedia-entrypreview-summary">
            <h3 className="oyk-page-encyclopedia-entrypreview-title">{t("Summary")}</h3>
            <p>{entry?.summary}</p>
          </div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(entry, null, 2)}</pre>
        </div>
      }
      prependActions={
        <OykButton
          label={t("Close")}
          variant="ghost"
          onClick={() => setDrawerOpen(false)}
        />
      }
      actions={
        <OykButton
          label={t("Edit Entry")}
          color="accent"
          onClick={() => {
            if (entry && onOpenEdit) {
              onOpenEdit(entry);
            }
          }}
        />
      }
    />
  );
}
