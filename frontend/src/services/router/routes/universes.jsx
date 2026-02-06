import React from "react";

export const UNIVERSES_ROUTES = [
  {
    name: "universes",
    component: React.lazy(() => import("../../../pages/Universes")),
    paths: {
      fr: "u",
      en: "u",
    },
    children: [
      {
        name: "universe",
        component: React.lazy(() => import("../../../pages/Universes/Admin")),
        paths: {
          fr: "{universeSlug}",
          en: "{universeSlug}",
        },
        children: [
          {
            name: "universe-admin",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "admin",
              en: "admin",
            },
            params: {
              section: "profile",
            },
            children: [
              {
                name: "universe-admin-profile",
                component: React.lazy(() => import("../../../pages/Universes/Admin")),
                paths: {
                  fr: "profil",
                  en: "profile",
                },
                params: {
                  section: "profile",
                },
              },
              {
                name: "universe-admin-modules",
                component: React.lazy(() => import("../../../pages/Universes/Admin")),
                paths: {
                  fr: "modules",
                  en: "modules",
                },
                params: {
                  section: "modules",
                },
              },
              {
                name: "universe-admin-theme",
                component: React.lazy(() => import("../../../pages/Universes/Admin")),
                paths: {
                  fr: "theme",
                  en: "theme",
                },
                params: {
                  section: "theme",
                },
              },
              {
                name: "universe-admin-stylesheet",
                component: React.lazy(() => import("../../../pages/Universes/Admin")),
                paths: {
                  fr: "stylesheet",
                  en: "stylesheet",
                },
                params: {
                  section: "stylesheet",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
