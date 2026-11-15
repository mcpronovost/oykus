import "@/assets/styles/pages/_encyclopedia.scss";
import { useState } from "react";
import { IconBooksOff, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  type TypeEncyclopediaEntry,
  listEncyclopediaCategories,
  listEncyclopediaEntries,
  queryKeys,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykDivider,
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";
import OykEncyclopediaModalsCreateEntry from "./modals/EntryCreate";
import OykEncyclopediaDrawerEntry from "./drawers/EntryPreview";
import OykEncyclopediaEntryCard from "./EntryCard";

export default function OykEncyclopediaTopic() {
  const { user } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;
  const topicSlug = params?.topic ?? null;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalCreateEntryOpen, setModalCreateEntryOpen] = useState(false);
  const [drawerEntryOpen, setDrawerEntryOpen] = useState(false);
  const [drawerEntry, setDrawerEntry] = useState<TypeEncyclopediaEntry | null>(null);

  if (!spaceId) {
    return (
      <div className="oyk-page-encyclopedia">
        <OykGrid>
          <OykHeading
            title={t(`encyclopedia.topic.${topicSlug}`)}
            suptitle={t("Encyclopedia")}
          />
          <OykResult
            title={t("No space selected")}
            message={t("Choose a space to view encyclopedia entries")}
            variant="ghost"
          />
        </OykGrid>
      </div>
    );
  }

  const {
    data: entries = [],
    isPending: isEntriesPending,
    isError: isEntriesError,
    refetch: refetchEntries,
  } = useQuery({
    queryKey: queryKeys.encyclopedia.list(spaceId ?? "", topicSlug),
    queryFn: () => listEncyclopediaEntries(spaceId!, topicSlug),
    enabled: Boolean(spaceId),
  });

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: queryKeys.encyclopedia.categories(topicSlug),
    queryFn: () => listEncyclopediaCategories(topicSlug),
    enabled: Boolean(spaceId),
  });

  const handleClickCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEntryClick = (entry: TypeEncyclopediaEntry) => {
    setDrawerEntry(entry);
    setDrawerEntryOpen(true);
  };

  const isPending = isEntriesPending || isCategoriesPending;
  const isError = isEntriesError || isCategoriesError;
  const uncategorizedEntries = entries.filter(
    (entry) => entry.categoryId === null,
  );
  const populatedCategories = categories.filter((category) =>
    entries.some((entry) => entry.categoryId === category.id),
  );
  const hasCategorizedEntries = populatedCategories.length > 0;
  const hasUncategorizedEntries = uncategorizedEntries.length > 0;
  const categoryFilters = [
    "all",
    ...populatedCategories.map((category) => category.slug),
    ...(hasCategorizedEntries && hasUncategorizedEntries ? ["other"] : []),
  ];
  const visibleCategories = populatedCategories.filter(
    (category) =>
      selectedCategory === "all" || selectedCategory === category.slug,
  );
  const showUncategorized =
    hasUncategorizedEntries &&
    (selectedCategory === "all" || selectedCategory === "other");
  const showUncategorizedDivider = hasCategorizedEntries && showUncategorized;

  return (
    <div className="oyk-page-encyclopedia">
      <OykEncyclopediaModalsCreateEntry
        modalOpen={modalCreateEntryOpen}
        setModalOpen={setModalCreateEntryOpen}
        topicSlug={topicSlug}
        categories={categories}
      />
      <OykEncyclopediaDrawerEntry
        drawerOpen={drawerEntryOpen}
        setDrawerOpen={setDrawerEntryOpen}
        entry={drawerEntry}
      />
      <OykGrid>
        <OykHeading
          title={t(`encyclopedia.topic.${topicSlug}`)}
          suptitle={t("Encyclopedia")}
          actions={
            <OykButton
              label={t("encyclopedia.newEntry")}
              color="accent"
              start={IconPlus}
              onClick={() => setModalCreateEntryOpen(true)}
            />
          }
        />
        {!isPending && !isError && hasCategorizedEntries ? (
          <OykGrid.Row>
            <OykGrid.Col flex="horizontal" justify="start">
              {categoryFilters.map((c) => (
                <OykButton
                  key={c}
                  label={t(`encyclopedia.category.${c}`)}
                  size="sm"
                  color={selectedCategory === c ? "accent" : "default"}
                  onClick={() => handleClickCategory(c)}
                />
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        ) : null}

        {isPending ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("Loading entries")}
                message={t("Fetching encyclopedia entries for this space...")}
                variant="ghost"
              />
            </OykGrid.Col>
          </OykGrid.Row>
        ) : isError ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("Could not load entries")}
                message={t(
                  "Something went wrong while fetching encyclopedia entries",
                )}
                color="danger"
                variant="ghost"
              >
                <OykButton
                  label={t("Try again")}
                  color="accent"
                  onClick={() => {
                    void refetchEntries();
                    void refetchCategories();
                  }}
                />
              </OykResult>
            </OykGrid.Col>
          </OykGrid.Row>
        ) : entries.length === 0 ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("No entries yet")}
                message={t(
                  "Create your first {topic} entry to get started",
                  undefined,
                  { topic: t(`encyclopedia.topic.${topicSlug}`) },
                )}
                variant="ghost"
                icon={IconBooksOff}
              />
            </OykGrid.Col>
          </OykGrid.Row>
        ) : (
          <>
            {visibleCategories.map((category) => {
              const categoryEntries = entries.filter(
                (entry) => entry.categoryId === category.id,
              );

              return (
                <OykGrid.Row key={category.id}>
                  <OykGrid.Col>
                    <OykDivider
                      start={t(`encyclopedia.category.${category.slug}`)}
                      end={`${t("{count} entries", categoryEntries.length)}`}
                    />
                  </OykGrid.Col>
                    {categoryEntries.map((entry) => (
                      <OykGrid.Col key={entry.id} size={{ xs: 24, md: 12, xl: 8, xxl: 6 }}>
                        <OykEncyclopediaEntryCard entry={entry} onClick={() => handleEntryClick(entry)} />
                      </OykGrid.Col>
                    ))}
                </OykGrid.Row>
              );
            })}
            {showUncategorized ? (
              <OykGrid.Row>
                {showUncategorizedDivider ? (
                  <OykGrid.Col>
                    <OykDivider
                      start={t("encyclopedia.category.other")}
                      end={`${t("{count} entries", uncategorizedEntries.length)}`}
                    />
                  </OykGrid.Col>
                ) : null}
                {uncategorizedEntries.map((entry) => (
                  <OykGrid.Col key={entry.id} size={{ xs: 24, md: 12, xl: 8, xxl: 6 }}>
                    <OykEncyclopediaEntryCard entry={entry} onClick={() => handleEntryClick(entry)} />
                  </OykGrid.Col>
                ))}
              </OykGrid.Row>
            ) : null}
          </>
        )}
      </OykGrid>
    </div>
  );
}
