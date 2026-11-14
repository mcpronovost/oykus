import type { TypeEncyclopediaEntry } from "@/services/api";
import { OykCard } from "@/components/ui";

interface OykEncyclopediaEntryCardProps {
  entry: TypeEncyclopediaEntry;
  onClick: () => void;
}

export default function OykEncyclopediaEntryCard({
  entry,
  onClick,
}: OykEncyclopediaEntryCardProps) {
  return (
    <OykCard hoverable clickable onClick={onClick}>
      {entry.title}
    </OykCard>
  );
}
