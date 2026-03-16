import React from "react";

export const FRIENDS_ROUTES = [
  {
    name: "friends",
    component: React.lazy(() => import("../../../pages/Friends")),
    require_auth: true,
    paths: {
      fr: "amis",
      en: "friends",
    },
    params: {
      section: "friends"
    },
  },
  {
    name: "friends-requests",
    component: React.lazy(() => import("../../../pages/Friends")),
    require_auth: true,
    paths: {
      fr: "amis-demandes",
      en: "friends-requests",
    },
    params: {
      section: "friends-requests"
    },
  },
];
