import { OykBanner, OykCard, OykGrid, OykGridRow, OykGridCol } from "@/components/ui";

export default function OykCreateWorld() {
  const worldGenres = [
    {
      genre: "Fantasy",
    },
    {
      genre: "Modern",
    },
    {
      genre: "Sci-Fi",
    },
    {
      genre: "Other",
    }
  ];

  return (
    <section>
      <OykGrid>
        <OykGridRow wrap>
          {worldGenres.map((item) => (
            <OykGridCol col="25">
              <article>
                <OykCard nop fullCenter alignSpace clickable>
                  <header>
                    <OykBanner />
                    <h2>{item.genre}</h2>
                  </header>
                </OykCard>
              </article>
            </OykGridCol>
          ))}
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
