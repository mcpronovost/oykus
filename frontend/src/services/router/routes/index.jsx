import React from "react";
import { AUTH_ROUTES } from "./auth";
import { COMMUNITY_ROUTES } from "./community";
import { UNIVERSES_ROUTES } from "./universes";
import { FRIENDS_ROUTES } from "./friends";
import { DEV_ROUTES } from "./dev";

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
    name: "about",
    component: React.lazy(() => import("../../../pages/About")),
    paths: {
      fr: "a-propos",
      en: "about",
    },
  },
  {
    name: "devlog",
    component: React.lazy(() => import("../../../pages/Devlog")),
    paths: {
      fr: "devlog",
      en: "devlog",
    },
  },
  {
    name: "discover",
    component: React.lazy(() => import("../../../pages/Discover")),
    paths: {
      fr: "decouvrir",
      en: "discover",
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
  ...AUTH_ROUTES,
  ...COMMUNITY_ROUTES,
  ...UNIVERSES_ROUTES,
  ...FRIENDS_ROUTES,
  ...DEV_ROUTES,
  {
    name: "404",
    component: React.lazy(() => import("../../../pages/Error404")),
    paths: {
      fr: "404",
      en: "404",
    },
  },
];
