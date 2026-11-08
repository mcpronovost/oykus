import { useState } from "react";
import { OykButton, OykCard, OykChip, OykGrid } from "@/components/ui";

const TEST_DATA = [
  {
    id: 1,
    category: "other",
    title: "Note 1",
    description: "Short note.",
  },
  {
    id: 2,
    category: "idea",
    title: "Note 2",
    description:
      "A longer note with more text so the card grows and the masonry columns stagger visibly across the layout.",
  },
  {
    id: 3,
    category: "thought",
    title: "Note 3",
    description: "Medium length note for the middle column heights.",
  },
  {
    id: 4,
    category: "inspiration",
    title: "Note 4",
    description:
      "Another tall card. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  },
  {
    id: 5,
    category: "quote",
    title: "Note 5",
    description: "Tiny.",
  },
  {
    id: 6,
    category: "question",
    title: "Note 6",
    description: "Brief reminder about the plot twist in chapter three.",
  },
  {
    id: 7,
    category: "character",
    title: "Note 7",
    description:
      "Character backstory dump: orphaned young, trained by a mentor, fears water, carries a token from home. Needs more scenes before the finale.",
  },
  {
    id: 8,
    category: "idea",
    title: "Note 8",
    description: "Worldbuilding scrap.",
  },
];

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Idea", value: "idea" },
  { label: "Inspiration", value: "inspiration" },
  { label: "Quote", value: "quote" },
  { label: "Question", value: "question" },
  { label: "Thought", value: "thought" },
] as const;

export default function OykMasonry() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const items =
    currentCategory === null
      ? TEST_DATA
      : TEST_DATA.filter((item) => item.category === currentCategory);

  return (
    <OykGrid.Row>
      <OykGrid.Col size={24} flex="horizontal" gap={8}>
        {CATEGORIES.map((category) => (
          <OykButton
            key={category.label}
            label={category.label}
            size="sm"
            color={currentCategory === category.value ? "accent" : "default"}
            onClick={() => setCurrentCategory(category.value)}
          />
        ))}
      </OykGrid.Col>
      <OykGrid.Col size={24}>
        <div className="oyk-masonry">
          {items.map((item) => (
            <div key={item.id} className="oyk-masonry-item">
              <OykCard hoverable gradient="accent" pad="lg">
                <div style={{ marginBottom: "1rem" }}>
                  <OykChip label={item.category} variant="ghost" color="accent" />
                </div>
                <p>{item.description}</p>
              </OykCard>
            </div>
          ))}
        </div>
      </OykGrid.Col>
    </OykGrid.Row>
  );
}
