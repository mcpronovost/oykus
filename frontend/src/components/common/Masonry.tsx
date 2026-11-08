import { OykCard } from "@/components/ui";

const TEST_DATA = [
  {
    id: 1,
    title: "Note 1",
    description: "Short note.",
  },
  {
    id: 2,
    title: "Note 2",
    description:
      "A longer note with more text so the card grows and the masonry columns stagger visibly across the layout.",
  },
  {
    id: 3,
    title: "Note 3",
    description: "Medium length note for the middle column heights.",
  },
  {
    id: 4,
    title: "Note 4",
    description:
      "Another tall card. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  },
  {
    id: 5,
    title: "Note 5",
    description: "Tiny.",
  },
  {
    id: 6,
    title: "Note 6",
    description: "Brief reminder about the plot twist in chapter three.",
  },
  {
    id: 7,
    title: "Note 7",
    description:
      "Character backstory dump: orphaned young, trained by a mentor, fears water, carries a token from home. Needs more scenes before the finale.",
  },
  {
    id: 8,
    title: "Note 8",
    description: "Worldbuilding scrap.",
  },
];

export default function OykMasonry() {
  return (
    <div className="oyk-masonry">
      {TEST_DATA.map((item) => (
        <div key={item.id} className="oyk-masonry-item">
          <OykCard hoverable gradient="accent" pad="lg">
            <p>{item.description}</p>
          </OykCard>
        </div>
      ))}
    </div>
  );
}
