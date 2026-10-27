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
];
