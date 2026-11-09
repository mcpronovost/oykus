import type { TypeAuthContextValue, TypeAuthProviderProps } from "./types";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  getMe,
  login as apiLogin,
  logout as apiLogout,
  queryKeys,
  type TypePublicUser,
} from "@/services/api";

const AuthContext = import.meta.hot?.data.AuthContext ?? createContext<TypeAuthContextValue | undefined>(undefined);

if (import.meta.hot) {
  import.meta.hot.data.AuthContext = AuthContext;
}

const INITIAL_STATE: TypeAuthContextValue = {
  isAuth: false,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => null,
};

async function fetchCurrentUser(): Promise<TypePublicUser | null> {
  try {
    return await getMe();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function AuthProvider({ children }: TypeAuthProviderProps) {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.user.me,
    queryFn: fetchCurrentUser,
    staleTime: 30_000,
    retry: 1,
    refetchInterval: (query) => (query.state.data ? 60_000 : false),
  });

  const clearSession = async () => {
    await queryClient.cancelQueries({ queryKey: queryKeys.user.me });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== queryKeys.user.me[0],
    });
    queryClient.setQueryData(queryKeys.user.me, null);
  };

  const login = async (username: string, password: string) => {
    const nextUser = await apiLogin(username, password);
    queryClient.setQueryData(queryKeys.user.me, nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      await clearSession();
    }
  };

  const refresh = async () => {
    const result = await refetch({ throwOnError: true });
    return result.data ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth: Boolean(user),
        user,
        isLoading: isPending,
        hasError: isError,
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
    if (import.meta.hot) {
      return INITIAL_STATE;
    }
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
