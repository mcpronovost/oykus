import React from "react";

import { WORLD_ROUTES } from "./world";

export const ROUTES = [
  {
    name: "home",
    component: React.lazy(() => import("../../../pages/Home")),
    paths: {
      fr: "",
      en: "",
    },
  },
  {
    name: "login",
    component: React.lazy(() => import("../../../pages/Auth/Login")),
    paths: {
      fr: "connexion",
      en: "login",
    },
  },
  {
    name: "register",
    component: React.lazy(() => import("../../../pages/Auth/Register")),
    paths: {
      fr: "inscription",
      en: "register",
    },
  },
  {
    name: "about",
    component: React.lazy(() => import("../../../pages/About")),
    paths: {
      fr: "a-propos",
      en: "about",
    },
  },
  {
    name: "privacy-policy",
    component: React.lazy(() => import("../../../pages/PrivacyPolicy")),
    paths: {
      fr: "politique-de-confidentialite",
      en: "privacy-policy",
    },
  },
  {
    name: "tasks",
    component: React.lazy(() => import("../../../pages/Tasks")),
    paths: {
      fr: "taches",
      en: "tasks",
    },
  },
  ...WORLD_ROUTES,
  {
    name: "components",
    component: React.lazy(() => import("../../../pages/Components")),
    paths: {
      fr: "composants",
      en: "components",
    },
  },
  {
    name: "404",
    component: React.lazy(() => import("../../../pages/Error404")),
    paths: {
      fr: "404",
      en: "404",
    },
  },
];
