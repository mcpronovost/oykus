import React from "react";

export const UNIVERSES_ROUTES = [
  {
    name: "universes",
    component: React.lazy(() => import("../../../pages/Dev")),
    paths: {
      fr: "u",
      en: "u",
    },
    children: [
      {
        name: "dev-components",
        component: React.lazy(() => import("../../../pages/Dev/Components")),
        require_dev: true,
        paths: {
          fr: "composants",
          en: "components",
        },
      },
    ],
  },
];