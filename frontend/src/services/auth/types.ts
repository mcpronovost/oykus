import type { ReactNode } from "react";

export interface TypeAuthContextValue {
  isAuth: boolean;
  setAuth: (value: boolean) => void;
  login: () => void;
  logout: () => void;
}

export interface TypeAuthProviderProps {
  children: ReactNode;
}
