import React from "react";

export default [
  {
    name: "encyclopedia",
    component: React.lazy(() => import("../../../pages/Features/Encyclopedia/index")),
    paths: {
      fr: "encyclopedie",
      en: "encyclopedia",
    },
    auth: true,
    children: [
      {
        name: "encyclopedia-characters",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "personnages",
          en: "characters",
        },
        params: {
          topic: "characters",
        },
        auth: true,
      },
      {
        name: "encyclopedia-factions",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "factions",
          en: "factions",
        },
        params: {
          topic: "factions",
        },
        auth: true,
      },
      {
        name: "encyclopedia-locations",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "lieux",
          en: "locations",
        },
        params: {
          topic: "locations",
        },
        auth: true,
      },
      {
        name: "encyclopedia-nature",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "nature",
          en: "nature",
        },
        params: {
          topic: "nature",
        },
        auth: true,
      },
      {
        name: "encyclopedia-items",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "objets",
          en: "items",
        },
        params: {
          topic: "items",
        },
        auth: true,
      },
      {
        name: "encyclopedia-events",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "evenements",
          en: "events",
        },
        params: {
          topic: "events",
        },
        auth: true,
      },
      {
        name: "encyclopedia-lore",
        component: React.lazy(() => import("../../../pages/Features/Encyclopedia/Topic")),
        paths: {
          fr: "lore",
          en: "lore",
        },
        params: {
          topic: "lore",
        },
        auth: true,
      },
    ],
  },
];
