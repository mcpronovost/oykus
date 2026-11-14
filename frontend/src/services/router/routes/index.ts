import type { TypeRoute } from "../types";
import React from "react";

export const ROUTES: TypeRoute[] = [
  {
    name: "home",
    component: React.lazy(() => import("../../../pages/Home")),
    paths: {
      fr: "",
      en: "",
    },
    auth: false,
  },
  {
    name: "dashboard",
    component: React.lazy(() => import("../../../pages/Dashboard/index")),
    paths: {
      fr: "",
      en: "",
    },
    auth: true,
  },
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
      },
    ],
  },
  {
    name: "notes",
    component: React.lazy(() => import("../../../pages/Features/Notes/index")),
    paths: {
      fr: "notes",
      en: "notes",
    },
    auth: true,
  },
  {
    name: "login",
    component: React.lazy(() => import("../../../pages/Auth/Login")),
    paths: {
      fr: "connexion",
      en: "login",
    },
    auth: false,
  },
  {
    name: "register",
    component: React.lazy(() => import("../../../pages/Auth/Register")),
    paths: {
      fr: "inscription",
      en: "register",
    },
    auth: false,
  },
  {
    name: "dev",
    component: React.lazy(() => import("../../../pages/Dev")),
    paths: {
      fr: "dev",
      en: "dev",
    },
    auth: true,
    children: [
      {
        name: "dev-components",
        component: React.lazy(() => import("../../../pages/Dev/Components")),
        paths: {
          fr: "composants",
          en: "components",
        },
      },
      {
        name: "dev-laboratory",
        component: React.lazy(() => import("../../../pages/Dev/Laboratory")),
        paths: {
          fr: "laboratoire",
          en: "laboratory",
        },
      },
    ],
  }
];
