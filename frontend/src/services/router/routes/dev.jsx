import React from "react";

export const DEV_ROUTES = [
  {
    name: "dev",
    component: React.lazy(() => import("../../../pages/Dev")),
    paths: {
      fr: "dev",
      en: "dev",
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