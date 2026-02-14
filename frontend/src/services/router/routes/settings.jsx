import React from "react";

export const SETTINGS_ROUTES = [
  {
    name: "settings",
    component: React.lazy(() => import("../../../pages/Settings")),
    paths: {
      fr: "parametres",
      en: "settings",
    },
    params: {
      section: "profile"
    },
    children: [
      {
        name: "settings-profile",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "profil",
          en: "profile",
        },
        params: {
          section: "profile"
        },
      },
      {
        name: "settings-account",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "compte",
          en: "account",
        },
        params: {
          section: "account"
        },
      },
      {
        name: "settings-account-preferences",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "compte-preferences",
          en: "account-preferences",
        },
        params: {
          section: "account-preferences"
        },
      },
      {
        name: "settings-account-password",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "compte-mot-de-passe",
          en: "account-password",
        },
        params: {
          section: "account-password"
        },
      },
      {
        name: "settings-account-privacy",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "compte-vie-privee",
          en: "account-privacy",
        },
        params: {
          section: "account-privacy"
        },
      },
      {
        name: "settings-friends",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "amis",
          en: "friends",
        },
        params: {
          section: "friends"
        },
      },
      {
        name: "settings-friends-requests",
        component: React.lazy(() => import("../../../pages/Settings")),
        paths: {
          fr: "amis-demandes",
          en: "friends-requests",
        },
        params: {
          section: "friends-requests"
        },
      },
    ],
  },
];
