import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IconX } from "@tabler/icons-react";
import { OykButton, OykCard, OykChip, OykGrid } from "@/components/ui";
import type { TypeNote } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { sortCategories } from "@/utils";

function getColumnCount(width: number) {
  if (width >= 1600) return 5;
  if (width >= 1200) return 4;
  if (width >= 768) return 3;
  if (width >= 576) return 2;
  return 1;
}

function distributeItems<T>(items: T[], columnCount: number) {
  const count = Math.max(1, columnCount);
  const columns: { item: T; index: number }[][] = Array.from(
    { length: count },
    () => [],
  );

  items.forEach((item, index) => {
    columns[index % count].push({ item, index });
  });

  return columns;
}

export default function OykMasonry({
  notes = [],
  onDeleteNote,
}: {
  notes?: TypeNote[];
  onDeleteNote?: (note: TypeNote) => void;
}) {
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
      setColumnCount(getColumnCount(observedEl.clientWidth));
    };

    updateColumnCount();

    const resizeObserver = new ResizeObserver(updateColumnCount);
    resizeObserver.observe(observedEl);

    return () => resizeObserver.disconnect();
  }, []);

  const usedCategories = sortCategories(
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

  const columns = distributeItems(items, columnCount);

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
                    {item.category || onDeleteNote ? (
                      <div className="oyk-masonry-item-header">
                        {item.category ? (
                          <OykChip
                            label={t(`note.category.${item.category.label}`)}
                            variant="ghost"
                            color="accent"
                          />
                        ) : (
                          <span />
                        )}
                        {onDeleteNote ? (
                          <button
                            type="button"
                            className="oyk-masonry-item-delete"
                            onClick={() => onDeleteNote(item)}
                            aria-label={t("Delete note")}
                          >
                            <IconX size={16} />
                          </button>
                        ) : null}
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
