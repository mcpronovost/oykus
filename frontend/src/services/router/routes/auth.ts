import React from "react";

export default [
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
];
