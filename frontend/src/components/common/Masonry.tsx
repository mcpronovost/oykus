import { useState, type CSSProperties } from "react";
import { OykButton, OykCard, OykChip, OykGrid } from "@/components/ui";
import type { TypeNote, TypeNoteCategory } from "@/services/api";
import { useTranslation } from "@/services/translation";

function formatCategoryLabel(label: string) {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function OykMasonry({ notes = [] }: { notes?: TypeNote[] }) {
  const { t } = useTranslation();
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  const usedCategories = notes.reduce<TypeNoteCategory[]>((acc, note) => {
    if (!note.category) return acc;
    if (acc.some((category) => category.id === note.category!.id)) return acc;
    return [...acc, note.category];
  }, []);

  const items =
    currentCategoryId === null
      ? notes
      : notes.filter((note) => note.categoryId === currentCategoryId);

  return (
    <OykGrid.Row>
      <OykGrid.Col size={24} flex="horizontal" gap={8}>
        <OykButton
          label={t("All")}
          size="sm"
          color={currentCategoryId === null ? "accent" : "default"}
          onClick={() => setCurrentCategoryId(null)}
        />
        {usedCategories.map((category) => (
          <OykButton
            key={category.id}
            label={formatCategoryLabel(category.label)}
            size="sm"
            color={currentCategoryId === category.id ? "accent" : "default"}
            onClick={() => setCurrentCategoryId(category.id)}
          />
        ))}
      </OykGrid.Col>
      <OykGrid.Col size={24}>
        <div className="oyk-masonry" key={currentCategoryId ?? "all"}>
          {items.map((item, index) => (
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
                      label={formatCategoryLabel(item.category.label)}
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
      </OykGrid.Col>
    </OykGrid.Row>
  );
}
