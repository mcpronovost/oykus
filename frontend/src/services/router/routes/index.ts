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
    component: React.lazy(() => import("../../../pages/Dashboard")),
    paths: {
      fr: "",
      en: "",
    },
    auth: true,
  },
  {
    name: "encyclopedia",
    component: React.lazy(() => import("../../../pages/Encyclopedia")),
    paths: {
      fr: "encyclopedia",
      en: "encyclopedia",
    },
    auth: true,
  },
  {
    name: "notes",
    component: React.lazy(() => import("../../../pages/Notes")),
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
