import React from "react";

export const FRIENDS_ROUTES = [
  {
    name: "friends",
    component: React.lazy(() => import("../../../pages/Friends")),
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
    paths: {
      fr: "amis-demandes",
      en: "friends-requests",
    },
    params: {
      section: "friends-requests"
    },
  },
];
