import { OykBanner, OykCard, OykGrid, OykLink } from "@/components/ui";

export default function OykCommonGameHeader({ game }) {
  if (!game) return null;

  return (
    <header id="oyk-game-header">
      <OykGrid id="oyk-game-header-wrapper">
        <OykCard nop fullCenter>
          <OykBanner height={256} showAvatar={false} coverSrc={game.cover} coverHeight={256} />
        </OykCard>
      </OykGrid>
      <h1 id="oyk-game-header-logo">
        <OykLink routeName="universe-game" params={{ universeSlug: game.slug }}>
          {game.name}
        </OykLink>
      </h1>
      {game.tagline && <p>{game.tagline}</p>}
    </header>
  );
}
