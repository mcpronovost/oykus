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
    component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/index")),
    paths: {
      fr: "encyclopedie",
      en: "encyclopedia",
    },
    auth: true,
    children: [
      {
        name: "encyclopedia-characters",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Characters/index")),
        paths: {
          fr: "personnages",
          en: "characters",
        },
      },
      {
        name: "encyclopedia-factions",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Factions/index")),
        paths: {
          fr: "factions",
          en: "factions",
        },
      },
      {
        name: "encyclopedia-locations",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Locations/index")),
        paths: {
          fr: "lieux",
          en: "locations",
        },
      },
      {
        name: "encyclopedia-nature",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Nature/index")),
        paths: {
          fr: "nature",
          en: "nature",
        },
      },
      {
        name: "encyclopedia-items",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Items/index")),
        paths: {
          fr: "objets",
          en: "items",
        },
      },
      {
        name: "encyclopedia-events",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Events/index")),
        paths: {
          fr: "evenements",
          en: "events",
        },
      },
      {
        name: "encyclopedia-lore",
        component: React.lazy(() => import("../../../pages/Tools/Encyclopedia/Lore/index")),
        paths: {
          fr: "lore",
          en: "lore",
        },
      },
    ],
  },
  {
    name: "notes",
    component: React.lazy(() => import("../../../pages/Tools/Notes/index")),
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
