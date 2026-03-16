import React from "react";

export const UNIVERSES_ADMIN_ROUTES = [
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
        children: [
          {
            name: "universe-admin-modules-blog",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "blog",
              en: "blog",
            },
            params: {
              section: "modules-blog",
            },
          },
          {
            name: "universe-admin-modules-forum",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "forum",
              en: "forum",
            },
            params: {
              section: "modules-forum",
            },
          },
          {
            name: "universe-admin-modules-planner",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "planificateur",
              en: "planner",
            },
            params: {
              section: "modules-planner",
            },
          },
          {
            name: "universe-admin-modules-progress",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "progression",
              en: "progress",
            },
            params: {
              section: "modules-progress",
            },
          },
          {
            name: "universe-admin-modules-progress-titles",
            component: React.lazy(() => import("../../../pages/Universes/Admin")),
            paths: {
              fr: "progression-titres",
              en: "progress-titles",
            },
            params: {
              section: "modules-progress-titles",
            },
          },
        ],
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
];
