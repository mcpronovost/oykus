import type { TypeRoute } from "../types";
import React from "react";
import ROUTES_AUTH from "./auth";
import ROUTES_ENCYCLOPEDIA from "./encyclopedia";

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
  ...ROUTES_AUTH,
  ...ROUTES_ENCYCLOPEDIA,
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
    name: "profile",
    component: React.lazy(() => import("../../../pages/Profile/index")),
    paths: {
      fr: "profil",
      en: "profile",
    },
    auth: true,
  },
  {
    name: "settings",
    component: React.lazy(() => import("../../../pages/Settings/index")),
    paths: {
      fr: "parametres",
      en: "settings",
    },
    auth: true,
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
