import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconLeafOff } from "@tabler/icons-react";
import { OykButton, OykCard, OykDivider, OykGrid, OykHeading, OykResult } from "@/components/ui";
import {
  listEncyclopediaCategories,
  listEncyclopediaEntries,
  queryKeys,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";

const TOPIC = "nature";

export default function OykEncyclopediaNature() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;

  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: entries = [],
    isPending: isEntriesPending,
    isError: isEntriesError,
    refetch: refetchEntries,
  } = useQuery({
    queryKey: queryKeys.encyclopedia.list(spaceId ?? "", TOPIC),
    queryFn: () => listEncyclopediaEntries(spaceId!, TOPIC),
    enabled: Boolean(spaceId),
  });

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: queryKeys.encyclopedia.categories(TOPIC),
    queryFn: () => listEncyclopediaCategories(TOPIC),
    enabled: Boolean(spaceId),
  });

  const handleClickCategory = (category: string) => {
    setSelectedCategory(category);
  };

  if (!spaceId) {
    return (
      <div className="oyk-page-encyclopedia">
        <OykGrid>
          <OykHeading title={t("Nature")} suptitle={t("Encyclopedia")} />
          <OykResult
            title={t("No space selected")}
            message={t("Choose a space to view encyclopedia entries.")}
            variant="ghost"
          />
        </OykGrid>
      </div>
    );
  }

  const isPending = isEntriesPending || isCategoriesPending;
  const isError = isEntriesError || isCategoriesError;
  const populatedCategories = categories.filter((category) =>
    entries.some((entry) => entry.categoryId === category.id),
  );
  const categoryFilters = ["all", ...populatedCategories.map((category) => category.slug)];
  const visibleCategories = populatedCategories.filter(
    (category) => selectedCategory === "all" || selectedCategory === category.slug,
  );

  return (
    <div className="oyk-page-encyclopedia">
      <OykGrid>
        <OykHeading
          title={t("Nature")}
          suptitle={t("Encyclopedia")}
          actions={<OykButton label={t("New Entry")} color="accent" />}
        />
        {!isPending && !isError && populatedCategories.length > 0 ? (
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
                message={t("Something went wrong while fetching encyclopedia entries.")}
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
        ) : populatedCategories.length === 0 ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("No entries yet")}
                message={t("Create your first nature entry to get started.")}
                variant="ghost"
                icon={IconLeafOff}
              />
            </OykGrid.Col>
          </OykGrid.Row>
        ) : (
          visibleCategories.map((category) => {
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
                <OykGrid.Col flex="horizontal" wrap>
                  {categoryEntries.map((entry) => (
                    <OykCard key={entry.id}>
                      {entry.title}
                    </OykCard>
                  ))}
                </OykGrid.Col>
              </OykGrid.Row>
            );
          })
        )}
      </OykGrid>
    </div>
  );
}
