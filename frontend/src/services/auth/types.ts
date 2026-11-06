import type { ReactNode } from "react";
import type { TypePublicUser } from "@/services/api";

export interface TypeAuthContextValue {
  isAuth: boolean;
  user: TypePublicUser | null;
  isLoading: boolean;
  hasError: boolean;
  login: (username: string, password: string) => Promise<TypePublicUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<TypePublicUser | null>;
}

export interface TypeAuthProviderProps {
  children: ReactNode;
}
