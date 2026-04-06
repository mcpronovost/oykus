import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";
import { oykUnit } from "@/utils";

import {
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykGridNav,
  OykGridMain,
  OykHeading,
  OykProgressCircular,
} from "@/components/ui";
import { OykSidenav } from "@/components/common";

export default function OykUniverseGameEconomyAssets() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, currentCharacter } = useWorld();

  const menu = [
    {
      id: "assets",
      title: t("Your Assets"),
      description: t("Manage your operations, productions, and logistical capacities"),
      Icon: Wallet,
      links: [
        {
          name: t("Tous"),
          routeName: "universe-game-economy-assets",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Exploitations"),
          routeName: "universe-game-economy-assets-operations",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Productions"),
          routeName: "universe-game-economy-assets-productions",
          params: { universeSlug: params?.universeSlug },
          disabled: true,
        },
        {
          name: t("Services"),
          routeName: "universe-game-economy-assets-services",
          params: { universeSlug: params?.universeSlug },
          disabled: true,
        },
        {
          name: t("Stockages"),
          routeName: "universe-game-economy-assets-storages",
          params: { universeSlug: params?.universeSlug },
          disabled: true,
        },
        {
          name: t("Transits"),
          routeName: "universe-game-economy-assets-transits",
          params: { universeSlug: params?.universeSlug },
          disabled: true,
        },
      ],
    },
  ];

  const operations = [
    {
      id: 1,
      name: "Mine du domaine Kur",
      location: "Kshirsagar - Ladkani",
      total: 5000,
      remains: 5000,
      workers: 30,
      ressource: {
        id: 1,
        name: "Hématite",
        place: "Mine",
        workers_min: 30,
        workers_max: 120,
        qty_per_year: 800,
      },
    },
    {
      id: 2,
      name: "Tourbière du Lac-des-Brumes",
      location: "Talviv - Hashmal",
      total: 1000,
      remains: 500,
      workers: 15,
      ressource: {
        id: 2,
        name: "Tourbe",
        place: "Tourbière",
        workers_min: 15,
        workers_max: 60,
        qty_per_year: 300,
      },
    },
  ];

  useEffect(() => {
    const controller = new AbortController();

    // TODO: Fetch dashboard data

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="oyk-page oyk-universe-game-economy-assets">
      <OykHeading title={t("Your Assets")} full />
      <OykGrid full>
        <OykGridRow>
          <OykGridNav>
            <OykSidenav menu={menu} />
          </OykGridNav>
          <OykGridMain>
            <section>
              <OykGridRow wrap>
                {operations.map((item) => (
                  <OykGridCol col="33" xl="50" lg="100">
                    <OykCard>
                      <h3>{item.name}</h3>
                      <small>{item.location}</small>
                      <hr />
                      <p>
                        Total : {item.total} | Restant : {item.remains}
                      </p>
                    </OykCard>
                  </OykGridCol>
                ))}
              </OykGridRow>
            </section>
          </OykGridMain>
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
