import { useEffect } from "react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykDisplay, OykGrid, OykHeading } from "@/components/ui";

import imgTestCardMyrrhSpore from "@/assets/img/edenwood/myrrh-spore.webp";
import imgTestCardFloreePrele from "@/assets/img/edenwood/floree-prele.webp";
import imgTestCardFarandoleFeufollet from "@/assets/img/edenwood/farandole-feufollet.webp";
import imgTestCardFarandolePuck from "@/assets/img/edenwood/farandole-puck.webp";
import imgTestCardSylveSlithy from "@/assets/img/edenwood/sylve-slithy.webp";

export default function Discover() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const displays = [
    { img: imgTestCardMyrrhSpore, name: "Spore", type: "Myrrh" },
    { img: imgTestCardFloreePrele, name: "Prêle", type: "Floree" },
    { img: imgTestCardFarandoleFeufollet, name: "Feu follet", type: "Farandole" },
    { img: imgTestCardSylveSlithy, name: "Slithy", type: "Sylve" },
    { img: imgTestCardFarandolePuck, name: "Puck", type: "Farandole" },
  ];

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Discover"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-discover">
      <OykHeading title={t("Discover")} />
      <OykGrid>
        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
          {displays.map((d, index) => (
            <OykDisplay
              key={index}
              img={d.img}
              name={d.name}
              type={d.type}
            />
          ))}
        </section>
      </OykGrid>
    </section>
  );
}