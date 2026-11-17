import React from "react";

export default [
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
    name: "login",
    component: React.lazy(() => import("../../../pages/Auth/Login")),
    paths: {
      fr: "connexion",
      en: "login",
    },
    auth: false,
  },
  {
    name: "logout",
    component: React.lazy(() => import("../../../pages/Auth/Logout")),
    paths: {
      fr: "deconnexion",
      en: "logout",
    },
  },
];
