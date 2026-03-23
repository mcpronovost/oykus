import { createContext, useContext, useMemo, useState } from "react";

import { api } from "@/services/api";
import { KEY_USER } from "@/services/store/constants";
import { storeGet, storeSet, storeRemove } from "@/services/store/utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => storeGet(KEY_USER) || null);
  const [isAuth, setIsAuth] = useState(() => !!storeGet(KEY_USER));
  const [isDev, setIsDev] = useState(() => storeGet(KEY_USER)?.is_dev || false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // ---------------------------------------------------------
  // Set user
  // ---------------------------------------------------------
  const setUser = (u) => {
    if (u) {
      const payload = { ...u, lastUpdate: Date.now() };
      setUserState(payload);
      storeSet(KEY_USER, payload);
      setIsAuth(true);
      setIsDev(!!u.is_dev);
    } else {
      setUserState(null);
      storeRemove(KEY_USER);
      setIsAuth(false);
      setIsDev(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch user
  // ---------------------------------------------------------
  const fetchUser = async (signal) => {
    setIsLoadingAuth(true);

    try {
      const r = await api.get("/auth/me/", signal ? { signal } : {});
      if (!r.ok) throw new Error();
      setUser(r.user);
    } catch {
      // Token invalid → logout
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const value = useMemo(
    () => ({
      currentUser: user,
      isAuth,
      isDev,
      isLoadingAuth,
      setUser,
      fetchUser,
    }),
    [user, isAuth, isDev, isLoadingAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
