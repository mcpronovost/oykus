import React from "react";

export const COMMUNITY_ROUTES = [
  {
    name: "community",
    component: React.lazy(() => import("../../../pages/Universes/Community")),
    paths: {
      fr: "communaute",
      en: "community",
    },
    children: [
      {
        name: "community-user-profile",
        component: React.lazy(() => import("../../../pages/Universes/Community/UserProfile")),
        paths: {
          fr: "{userSlug}",
          en: "{userSlug}",
        },
      },
    ],
  },
];
