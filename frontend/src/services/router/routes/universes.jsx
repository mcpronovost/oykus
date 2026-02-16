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
        component: React.lazy(() => import("../../../pages/Home")),
        paths: {
          fr: "{universeSlug}",
          en: "{universeSlug}",
        },
        children: [
          {
            name: "blog",
            component: React.lazy(() => import("../../../pages/Universes/Blog")),
            paths: {
              fr: "blog",
              en: "blog",
            },
            labels: {
              fr: "Blog",
              en: "Blog",
            },
            children: [
              {
                name: "blog-post",
                component: React.lazy(() => import("../../../pages/Universes/Blog/Post")),
                paths: {
                  fr: "{postId}",
                  en: "{postId}",
                },
              }
            ]
          },
          {
            name: "planner",
            component: React.lazy(() => import("../../../pages/Planner")),
            paths: {
              fr: "planificateur",
              en: "planner",
            },
          },
          {
            name: "achievements",
            component: React.lazy(() => import("../../../pages/Achievements")),
            paths: {
              fr: "succes",
              en: "achievements",
            },
          },
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
                      section: "module-blog",
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
                      section: "module-planner",
                    },
                  }
                ]
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
