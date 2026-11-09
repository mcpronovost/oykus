import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OykButton, OykCard, OykChip, OykGrid } from "@/components/ui";
import type { TypeNote } from "@/services/api";
import { useTranslation } from "@/services/translation";
import {
  distributeMasonryItems,
  getMasonryColumnCount,
  sortNoteCategories,
} from "@/utils";

export default function OykMasonry({ notes = [] }: { notes?: TypeNote[] }) {
  const { t } = useTranslation();
  const masonryRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const masonryEl = masonryRef.current;
    if (!masonryEl) return;

    const mainEl = masonryEl.closest(".oyk-core-main");
    const observedEl = mainEl instanceof HTMLElement ? mainEl : masonryEl;

    const updateColumnCount = () => {
      setColumnCount(getMasonryColumnCount(observedEl.clientWidth));
    };

    updateColumnCount();

    const resizeObserver = new ResizeObserver(updateColumnCount);
    resizeObserver.observe(observedEl);

    return () => resizeObserver.disconnect();
  }, []);

  const usedCategories = sortNoteCategories(
    notes.reduce<NonNullable<TypeNote["category"]>[]>((acc, note) => {
      if (!note.category) return acc;
      if (acc.some((category) => category.id === note.category!.id)) return acc;
      return [...acc, note.category];
    }, []),
    (category) => t(`note.category.${category.label}`),
  );

  const items =
    currentCategoryId === null
      ? notes
      : notes.filter((note) => note.categoryId === currentCategoryId);

  const columns = distributeMasonryItems(items, columnCount);

  return (
    <OykGrid.Row>
      <OykGrid.Col size={24} flex="horizontal" wrap gap={8}>
        <OykButton
          label={t("All")}
          size="sm"
          color={currentCategoryId === null ? "accent" : "default"}
          onClick={() => setCurrentCategoryId(null)}
        />
        {usedCategories.map((category) => (
          <OykButton
            key={category.id}
            label={t(`note.category.${category.label}`)}
            size="sm"
            color={currentCategoryId === category.id ? "accent" : "default"}
            onClick={() => setCurrentCategoryId(category.id)}
          />
        ))}
      </OykGrid.Col>
      <OykGrid.Col size={24}>
        <div
          ref={masonryRef}
          className="oyk-masonry"
          key={`${currentCategoryId ?? "all"}-${columnCount}`}
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="oyk-masonry-column">
              {column.map(({ item, index }) => (
                <div
                  key={item.id}
                  className="oyk-masonry-item"
                  style={
                    {
                      "--oyk-masonry-item-delay": `${index * 0.045}s`,
                    } as CSSProperties
                  }
                >
                  <OykCard hoverable gradient="accent" pad="lg">
                    {item.category ? (
                      <div style={{ marginBottom: "1rem" }}>
                        <OykChip
                          label={t(`note.category.${item.category.label}`)}
                          variant="ghost"
                          color="accent"
                        />
                      </div>
                    ) : null}
                    <p>{item.content}</p>
                  </OykCard>
                </div>
              ))}
            </div>
          ))}
        </div>
      </OykGrid.Col>
    </OykGrid.Row>
  );
}
