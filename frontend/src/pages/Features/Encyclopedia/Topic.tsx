import "@/assets/styles/pages/_encyclopedia.scss";
import { useState } from "react";
import { IconBooksOff, IconPlus } from "@tabler/icons-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  type TypeEncyclopediaEntry,
  getEncyclopediaCategoryCounts,
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
import OykEncyclopediaModalsEditEntry from "./modals/EntryEdit";
import OykEncyclopediaDrawerEntry from "./drawers/EntryPreview";
import OykEncyclopediaEntryCard from "./EntryCard";

type CategoryFilter = number | "all" | "uncategorized";

export default function OykEncyclopediaTopic() {
  const { user } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;
  const topicSlug = params?.topic ?? null;

  if (!spaceId || !topicSlug) {
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

  return <OykEncyclopediaTopicContent key={`${spaceId}/${topicSlug}`} spaceId={spaceId} topicSlug={topicSlug} />;
}

function OykEncyclopediaTopicContent({ spaceId, topicSlug }: { spaceId: string; topicSlug: string }) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [modalCreateEntryOpen, setModalCreateEntryOpen] = useState(false);
  const [modalEditEntryOpen, setModalEditEntryOpen] = useState(false);
  const [drawerEntryOpen, setDrawerEntryOpen] = useState(false);
  const [drawerEntry, setDrawerEntry] = useState<TypeEncyclopediaEntry | null>(null);
  const listKey = queryKeys.encyclopedia.list(spaceId, topicSlug);

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: queryKeys.encyclopedia.categories(topicSlug),
    queryFn: () => listEncyclopediaCategories(topicSlug),
  });

  const {
    data: counts = [],
    isPending: isCountsPending,
    isError: isCountsError,
    refetch: refetchCounts,
  } = useQuery({
    queryKey: [...listKey, "counts"],
    queryFn: () => getEncyclopediaCategoryCounts(spaceId, topicSlug),
  });

  const countByCategory = new Map(counts.map(({ categoryId, count }) => [categoryId, count]));
  const populatedCategories = categories.filter(({ id }) => (countByCategory.get(id) ?? 0) > 0);
  const uncategorizedCount = countByCategory.get(null) ?? 0;
  const hasCategorizedEntries = populatedCategories.length > 0;
  const categoryFilters: Array<{ id: CategoryFilter; slug: string }> = [
    { id: "all", slug: "all" },
    ...populatedCategories,
    ...(hasCategorizedEntries && uncategorizedCount > 0
      ? [{ id: "uncategorized" as const, slug: "other" }]
      : []),
  ];
  const activeFilter = categoryFilters.find(({ id }) => id === selectedCategory) ?? categoryFilters[0];
  const category = activeFilter.id === "all" ? undefined
    : activeFilter.id === "uncategorized" ? null : activeFilter.slug;

  const {
    data: entryPages,
    isPending: isEntriesPending,
    isError: isEntriesError,
    refetch: refetchEntries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: [...listKey, "entries", activeFilter.id],
    queryFn: ({ pageParam, signal }) => listEncyclopediaEntries(spaceId, topicSlug, category, pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
  });
  const entries = entryPages?.pages.flatMap((page) => page.items) ?? [];

  const handleEntryClick = (entry: TypeEncyclopediaEntry) => {
    setDrawerEntry(entry);
    setDrawerEntryOpen(true);
  };

  const handleOpenEdit = (entry: TypeEncyclopediaEntry) => {
    setDrawerEntry(entry);
    setModalEditEntryOpen(true);
  };

  const isPending = isEntriesPending || isCategoriesPending || isCountsPending;
  const isError = (isEntriesError && !entryPages) || isCategoriesError || isCountsError;
  const uncategorizedEntries = entries.filter(
    (entry) => entry.categoryId === null,
  );

  return (
    <div className="oyk-page-encyclopedia">
      <OykEncyclopediaModalsCreateEntry
        modalOpen={modalCreateEntryOpen}
        setModalOpen={setModalCreateEntryOpen}
        topicSlug={topicSlug}
        categories={categories}
      />
      <OykEncyclopediaModalsEditEntry
        modalOpen={modalEditEntryOpen}
        setModalOpen={setModalEditEntryOpen}
        entry={drawerEntry}
        onUpdated={setDrawerEntry}
        onDeleted={() => {
          setDrawerEntryOpen(false);
          setDrawerEntry(null);
        }}
      />
      <OykEncyclopediaDrawerEntry
        drawerOpen={drawerEntryOpen}
        setDrawerOpen={setDrawerEntryOpen}
        entry={drawerEntry}
        onOpenEdit={handleOpenEdit}
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
        {!isCategoriesPending && !isCountsPending && !isCategoriesError && !isCountsError && hasCategorizedEntries ? (
          <OykGrid.Row>
            <OykGrid.Col flex="horizontal" justify="start">
              {categoryFilters.map(({ id, slug }) => (
                <OykButton
                  key={id}
                  label={t(`encyclopedia.category.${slug}`)}
                  size="sm"
                  color={activeFilter.id === id ? "accent" : "default"}
                  onClick={() => setSelectedCategory(id)}
                />
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        ) : null}

        {isPending && !isError ? (
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
                    void refetchCounts();
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
            {categories.map((category) => {
              const categoryEntries = entries.filter(
                (entry) => entry.categoryId === category.id,
              );
              if (!categoryEntries.length) return null;
              const total = countByCategory.get(category.id);

              return (
                <OykGrid.Row key={category.id}>
                  <OykGrid.Col>
                    <OykDivider
                      start={t(`encyclopedia.category.${category.slug}`)}
                      end={total === undefined ? undefined : t("{count} entries", total)}
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
            {uncategorizedEntries.length > 0 ? (
              <OykGrid.Row>
                {hasCategorizedEntries ? (
                  <OykGrid.Col>
                    <OykDivider
                      start={t("encyclopedia.category.other")}
                      end={t("{count} entries", uncategorizedCount)}
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
            {hasNextPage && (
              <OykGrid.Row>
                <OykGrid.Col justify="center" flex="horizontal">
                  <OykButton
                    label={t(isFetchNextPageError ? "Try again" : "Load more")}
                    loading={isFetchingNextPage}
                    disabled={isFetchingNextPage}
                    onClick={() => void fetchNextPage({ cancelRefetch: false })}
                    variant="ghost"
                    color="accent"
                  />
                </OykGrid.Col>
              </OykGrid.Row>
            )}
          </>
        )}
      </OykGrid>
    </div>
  );
}
