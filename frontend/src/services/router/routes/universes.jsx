import React from "react";
import { UNIVERSES_ADMIN_ROUTES } from "./universes_admin";

export const UNIVERSES_ROUTES = [
  {
    name: "universes",
    component: React.lazy(() => import("../../../pages/Universes")),
    paths: {
      fr: "-",
      en: "-",
    },
    children: [
      {
        name: "universe",
        component: React.lazy(() => import("../../../pages/Universes/Dashboard")),
        paths: {
          fr: "{universeSlug}",
          en: "{universeSlug}",
        },
        children: [
          {
            name: "universe-community",
            component: React.lazy(() => import("../../../pages/Universes/Community")),
            paths: {
              fr: "communaute",
              en: "community",
            },
            children: [
              {
                name: "universe-community-profile",
                component: React.lazy(() => import("../../../pages/Universes/Community/ProfileCharacter")),
                paths: {
                  fr: "{characterSlug}",
                  en: "{characterSlug}",
                },
              },
            ],
          },
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
              },
            ],
          },
          {
            name: "universe-forum",
            component: React.lazy(() => import("../../../pages/Universes/Forum")),
            paths: {
              fr: "forum",
              en: "forum",
            },
            labels: {
              fr: "Forum",
              en: "Forum",
            },
          },
          {
            name: "planner",
            component: React.lazy(() => import("../../../pages/Universes/Planner")),
            paths: {
              fr: "planificateur",
              en: "planner",
            },
          },
          {
            name: "achievements",
            component: React.lazy(() => import("../../../pages/Universes/Achievements")),
            paths: {
              fr: "succes",
              en: "achievements",
            },
          },
          {
            name: "universe-progress",
            component: React.lazy(() => import("../../../pages/Universes/Progress")),
            paths: {
              fr: "progression",
              en: "progress",
            },
          },
          {
            name: "universe-collections",
            component: React.lazy(() => import("../../../pages/Universes/Collections")),
            paths: {
              fr: "collections",
              en: "collections",
            },
          },
          ...UNIVERSES_ADMIN_ROUTES,
        ],
      },
    ],
  },
];
