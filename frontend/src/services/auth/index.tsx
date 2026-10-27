import type { TypeAuthContextValue, TypeAuthProviderProps } from "./types";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<TypeAuthContextValue | undefined>(undefined);

const INITIAL_STATE: TypeAuthContextValue = {
  isAuth: true,
  setAuth: () => {},
  login: () => {},
  logout: () => {},
};

export function AuthProvider({ children }: TypeAuthProviderProps) {
  const [isAuth, setIsAuth] = useState(INITIAL_STATE.isAuth);

  const setAuth = (value: boolean) => {
    setIsAuth(value);
  };

  const login = () => {
    setIsAuth(true);
  };

  const logout = () => {
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, setAuth, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): TypeAuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    window.location.reload();
    return INITIAL_STATE;
  }
  return context;
}
