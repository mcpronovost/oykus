import React from "react";

export const ALERTS_ROUTES = [
  {
    name: "alerts",
    component: React.lazy(() => import("../../../pages/Alerts")),
    require_auth: true,
    paths: {
      fr: "alertes",
      en: "alerts",
    },
    params: {
      section: "alerts"
    },
  },
  {
    name: "alerts-unread",
    component: React.lazy(() => import("../../../pages/Alerts")),
    require_auth: true,
    paths: {
      fr: "alertes-nonlus",
      en: "alerts-unread",
    },
    params: {
      section: "alerts-unread"
    },
  },
];
