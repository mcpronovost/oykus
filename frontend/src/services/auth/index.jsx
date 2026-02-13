import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/services/api";
import { getUniverseSlugFromPath } from "@/services/router/utils";
import { KEY_RAT, KEY_USER, KEY_WORLD_UNIVERSES, KEY_WORLD_CURRENT_UNIVERSE } from "@/services/store/constants";
import { storeGet, storeSet, storeRemove, oykCookieSet, oykCookieDelete } from "@/services/store/utils";

const REFRESH_INTERVAL = 1000 * 60 * 5; // 5 minutes = 1000 * 60 * 5

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
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
    const r = storeGet(KEY_WORLD_UNIVERSES);
    return r ? r : null;
  });
  const [universe, setUniverseState] = useState(() => {
    const r = storeGet(KEY_WORLD_CURRENT_UNIVERSE);
    return r ? r : null;
  });
  const [theme, setTheme] = useState(null);

  const setUser = (u) => {
    if (u) {
      const payload = {
        ...u,
        lastUpdate: Date.now(),
      };
      setUserState(() => payload);
      storeSet(KEY_USER, payload);
      setIsAuth(true);
      setIsDev(u.is_dev);
    } else {
      setUserState(null);
      storeRemove(KEY_USER);
      setIsAuth(false);
      setIsDev(false);
      setUniverses(null);
      setUniverseState(null);
      clearUniverseTheme();
      oykCookieDelete("oyk-theme");
      storeRemove(KEY_WORLD_UNIVERSES);
      storeRemove(KEY_WORLD_CURRENT_UNIVERSE);
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
      setUserState((prev) => ({
        ...prev,
        notifications: {
          alerts: r.alerts || 0,
          friends: r.friends || 0,
          messages: r.messages || 0,
        },
      }));
    } catch {
      // fail silently
    }
  };

  const setUniverse = (u, clean = false) => {
    if (u) {
      let payload = {};
      if (clean) {
        payload = u;
      } else {
        payload = {
          ...universe,
          ...u,
        };
      }
      setUniverseState(payload);
      storeSet(KEY_WORLD_CURRENT_UNIVERSE, payload);
    } else {
      setUniverseState(null);
      storeRemove(KEY_WORLD_CURRENT_UNIVERSE);
    }
  };

  const fetchUniverses = async (signal) => {
    if (!user) return;
    try {
      const r = await api.get("/world/universes/", signal ? { signal } : {});
      if (!r.ok || !r.universes) throw Error();
      setUniverses(r.universes);
      storeSet(KEY_WORLD_UNIVERSES, r.universes);
      if (!universe) fetchCurrentUniverse(r.universes?.[0]?.slug, signal);
      else fetchCurrentUniverse(universe.slug, signal);
    } catch {
      setUniverses([]);
      storeRemove(KEY_WORLD_UNIVERSES);
    }
  };

  const fetchCurrentUniverse = async (slug = universe?.slug, signal) => {
    if (!slug) return;

    const pathSlug = getUniverseSlugFromPath(window.location.pathname);
    if (pathSlug && pathSlug !== slug) slug = pathSlug;

    setIsLoading(true);
    try {
      const r = await api.get(`/world/universes/${slug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();
      setUniverse(r.universe);
      storeSet(KEY_WORLD_CURRENT_UNIVERSE, r.universe);
      oykCookieSet("oyk-theme", r.universe.slug);
      if (r.theme) {
        setTheme(r.theme);
      } else setTheme(null);
    } catch {
      setUniverse(null);
      storeRemove(KEY_WORLD_CURRENT_UNIVERSE);
      oykCookieDelete("oyk-theme");
      setTheme(null);
      // window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const applyUniverseTheme = (theme = universe) => {
    if (!theme) return;
    let styleNode = document.getElementById("oyk-theme");

    if (!styleNode) {
      styleNode = document.createElement("style");
      styleNode.id = "oyk-theme";
      document.head.appendChild(styleNode);
    }

    styleNode.textContent = `
      :root {
        --oyk-c-primary: ${theme.c_primary};
        --oyk-c-primary-fg: ${theme.c_primary_fg};

        ${theme.variables ? Object.entries(theme.variables)
          .map(([k, v]) => `--oyk-${k}: ${v};`)
          .join("\n") : ""}
      }
    `;
  };

  const clearUniverseTheme = () => {
    const styleNode = document.getElementById("oyk-theme");

    if (!styleNode) return;

    styleNode.remove();
  };

  useEffect(() => {
    if (theme) applyUniverseTheme(theme);

    return () => {
      clearUniverseTheme();
    };
  }, [theme]);

  useEffect(() => {
    let controller = new AbortController();

    fetchUniverses(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isAuth]);

  useEffect(() => {
    let controller = new AbortController();

    const fetchAuth = () => {
      if (user?.lastUpdate && Date.now() - user?.lastUpdate > REFRESH_INTERVAL) {
        controller.abort();
        controller = new AbortController();
        fetchUser(controller.signal);
      }
    };

    const interval = setInterval(fetchAuth, 5 * 60 * 1000);
    fetchAuth();

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth: isLoading,
        currentUser: user,
        setUser,
        setRat,
        isAuth,
        isDev,
        universes,
        currentUniverse: universe,
        setUniverse,
        getUniverses: fetchUniverses,
        setCurrentUniverse: fetchCurrentUniverse,
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
    window.location.reload();
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
