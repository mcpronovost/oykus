import type { TypeAuthContextValue, TypeAuthProviderProps } from "./types";
import { createContext, useContext, useEffect, useState } from "react";
import { ApiError, getMe, login as apiLogin, logout as apiLogout, type TypePublicUser } from "@/services/api";

const AuthContext = createContext<TypeAuthContextValue | undefined>(undefined);

const INITIAL_STATE: TypeAuthContextValue = {
  isAuth: false,
  user: null,
  isLoading: true,
  setAuth: () => {},
  login: async () => {
    throw new Error("AuthProvider is missing");
  },
  logout: async () => {},
  refresh: async () => null,
};

export function AuthProvider({ children }: TypeAuthProviderProps) {
  const [user, setUser] = useState<TypePublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refresh();
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setAuth = (value: boolean) => {
    if (!value) {
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    const nextUser = await apiLogin(username, password);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth: Boolean(user),
        user,
        isLoading,
        setAuth,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
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
