import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { KEY_RAT, KEY_USER, KEY_GAME_UNIVERSES, KEY_GAME_CURRENT_UNIVERSE } from "@/services/store/constants";
import { storeGet, storeSet, storeRemove } from "@/services/store/utils";

const REFRESH_INTERVAL = 10 * 60 * 5; // 5 minutes = 1000 * 60 * 5

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const r = storeGet(KEY_USER);
    return r ? r : null;
  });
  const [isAuth, setIsAuth] = useState(() => {
    return user ? true : false;
  });
  const [isDev, setIsDev] = useState(() => {
    return user && user.is_dev ? true : false;
  });
  const [universes, setUniverses] = useState(() => {
    const r = storeGet(KEY_GAME_UNIVERSES);
    return r ? r : null;
  });

  const setUser = (user) => {
    if (user) {
      const payload = {
        ...user,
        lastUpdate: Date.now(),
      };
      setUserState(() => payload);
      storeSet(KEY_USER, payload);
      setIsAuth(true);
      setIsDev(user.is_dev);
    } else {
      setUserState(null);
      storeRemove(KEY_USER);
      setIsAuth(false);
      setIsDev(false);
      setUniverses(null);
      storeRemove(KEY_GAME_UNIVERSES);
      storeRemove(KEY_GAME_CURRENT_UNIVERSE);
    }
  };

  const setRat = (rat) => {
    if (rat) {
      storeSet(KEY_RAT, rat);
    } else {
      storeRemove(KEY_RAT);
    }
  };

  const fetchUser = async (signal) => {
    const token = storeGet(KEY_RAT);
    if (token) {
      try {
        // Validate token with backend
        const r = await api.get("/auth/me/", signal ? { signal } : {});
        if (!r.ok) throw new Error();
        setUser(r.user);
        fetchNotifications(signal);
      } catch {
        if (import.meta.env.PROD) {
          setRat(null);
          setUser(null);
        }
      }
    }
  };

  const fetchNotifications = async (signal) => {
    if (!user) return;
    try {
      const r = await api.get("/auth/me/notifications/", signal ? { signal } : {});
      if (!r?.ok) throw new Error();
      setUser({
        ...user,
        notifications: {
          alerts: r.alerts || 0,
          friends: r.friends || 0,
          messages: r.messages || 0,
        },
      });
    } catch {
      // fail silently
    }
  };
  
  const fetchUniverses = async (signal) => {
    if (!user) return;
    try {
      const r = await api.get("/game/universes/", signal ? { signal } : {});
      if (!r.ok || !r.universes) throw Error();
      setUniverses(r.universes);
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    const fetchAuth = () => {
      if (user?.lastUpdate && Date.now() - user?.lastUpdate > REFRESH_INTERVAL) {
        controller.abort();
        controller = new AbortController();
        fetchUser(controller.signal);
      }
    };

    const interval = setInterval(fetchAuth, 1 * 60 * 1000);
    fetchAuth();
    fetchUniverses(controller.signal);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: user,
        setUser,
        setRat,
        isAuth,
        isDev,
        universes,
        getUserNotifications: fetchNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
