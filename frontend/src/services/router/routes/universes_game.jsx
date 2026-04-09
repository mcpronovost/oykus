import React from "react";

export const UNIVERSES_GAME_ROUTES = [
  {
    name: "universe-game",
    component: React.lazy(() => import("../../../pages/Universes/Game")),
    paths: {
      fr: "jeu",
      en: "game",
    },
    labels: {
      fr: "Jeu",
      en: "Game",
    },
    children: [
      {
        name: "universe-game-zone",
        component: React.lazy(() => import("../../../pages/Universes/Game/World/GeoZone")),
        paths: {
          fr: "z{zoneId}",
          en: "z{zoneId}",
        },
        children: [
          {
            name: "universe-game-sector",
            component: React.lazy(() => import("../../../pages/Universes/Game/World/GeoSector")),
            paths: {
              fr: "s{sectorId}",
              en: "s{sectorId}",
            },
          },
        ]
      },
      {
        name: "universe-game-economy",
        component: React.lazy(() => import("../../../pages/Universes/Game")),
        paths: {
          fr: "economie",
          en: "economy",
        },
        children: [
          {
            name: "universe-game-economy-assets",
            component: React.lazy(() => import("../../../pages/Universes/Game/Economy/Assets")),
            paths: {
              fr: "passifs",
              en: "assets",
            },
            params: {
              section: "assets",
            },
          },
        ],
      },
    ],
  },
];
