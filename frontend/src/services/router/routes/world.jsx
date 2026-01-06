import React from "react";

export const WORLD_ROUTES = [
  {
    name: "w",
    component: React.lazy(() => import("../../../pages/Home")),
    paths: {
      fr: "w",
      en: "w",
    },
    children: [
      {
        name: "world-home",
        component: React.lazy(() => import("../../../pages/Worlds/Home")),
        paths: {
          fr: "{worldSlug}",
          en: "{worldSlug}",
        },
        children: [
          {
            name: "world-rulebook",
            component: React.lazy(() => import("../../../pages/Worlds/Rulebook")),
            paths: {
              fr: "reglement",
              en: "rulebook",
            },
          },
          {
            name: "world-support",
            component: React.lazy(() => import("../../../pages/Worlds/Support")),
            paths: {
              fr: "support",
              en: "support",
            },
          },
        ],
      },
    ],
  },
];
