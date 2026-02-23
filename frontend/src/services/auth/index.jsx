import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/services/api";
import { KEY_USER, KEY_RAT } from "@/services/store/constants";

import { storeGet, storeSet, storeRemove } from "@/services/store/utils";

const REFRESH_INTERVAL = 1000 * 60 * 5; // 5 minutes

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => storeGet(KEY_USER) || null);
  const [isAuth, setIsAuth] = useState(() => !!storeGet(KEY_USER));
  const [isDev, setIsDev] = useState(() => storeGet(KEY_USER)?.is_dev || false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // ---------------------------------------------------------
  // Token (rat)
  // ---------------------------------------------------------
  const setRat = (rat) => {
    if (rat) storeSet(KEY_RAT, rat);
    else storeRemove(KEY_RAT);
  };

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
    const token = storeGet(KEY_RAT);
    if (!token) return;

    setIsLoadingAuth(true);

    try {
      const r = await api.get("/auth/me/", signal ? { signal } : {});
      if (!r.ok) throw new Error();
      setUser(r.user);
    } catch {
      // Token invalid → logout
      setRat(null);
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: user,
        isAuth,
        isDev,
        isLoadingAuth,
        setUser,
        setRat,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
