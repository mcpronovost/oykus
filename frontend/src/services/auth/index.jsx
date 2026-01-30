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
  const [universe, setUniverse] = useState(() => {
    const r = storeGet(KEY_GAME_CURRENT_UNIVERSE);
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
      storeSet(KEY_GAME_UNIVERSES, r.universes);
      if (!universe) fetchCurrentUniverse(r.universes[0].slug, signal);
      else fetchCurrentUniverse(universe.slug, signal);
    } catch {
      // fail silently
    }
  };
  
  const fetchCurrentUniverse = async (slug = universe?.slug, signal) => {
    if (!slug) return;

    try {
      const r = await api.get(`/game/universes/${slug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();
      setUniverse(r.universe);
      storeSet(KEY_GAME_CURRENT_UNIVERSE, r.universe);
      if (r.theme) applyUniverseTheme(r.theme);
      else clearUniverseTheme();
    } catch {
      // fail silently
    }
  };

  const applyUniverseTheme = (theme = universe) => {
    if (!theme) return;
    const id = "oyk-universe-theme";
    let style = document.getElementById(id);

    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }

    style.textContent = `
      :root {
        --oyk-c-primary: ${theme.c_primary};
        --oyk-c-primary-fg: ${theme.c_primary_fg};

        ${theme.core_bg ? `--oyk-core-bg: ${theme.core_bg};` : ""}
        ${theme.core_bg_img ? `--oyk-core-bg-img: url('${theme.core_bg_img}');` : ""}
        ${theme.core_fg ? `--oyk-core-fg: ${theme.core_fg};` : ""}
        ${theme.core_divider ? `--oyk-core-divider: ${theme.core_divider};` : ""}

        ${theme.c_danger ? `--oyk-c-danger: ${theme.c_danger};` : ""}
        ${theme.c_warning ? `--oyk-c-warning: ${theme.c_warning};` : ""}
        ${theme.c_success ? `--oyk-c-success: ${theme.c_success};` : ""}

        ${theme.app_header_bg ? `--oyk-app-header-bg: ${theme.app_header_bg};` : ""}
        ${theme.app_header_fg ? `--oyk-app-header-fg: ${theme.app_header_fg};` : ""}

        ${theme.app_sidebar_bg ? `--oyk-app-sidebar-bg: ${theme.app_sidebar_bg};` : ""}
        ${theme.app_sidebar_fg ? `--oyk-app-sidebar-fg: ${theme.app_sidebar_fg};` : ""}
        ${theme.app_sidebar_bg_subtle ? `--oyk-app-sidebar-bg-subtle: ${theme.app_sidebar_bg_subtle};` : ""}

        ${theme.popper_bg ? `--oyk-popper-bg: ${theme.popper_bg};` : ""}
        ${theme.popper_fg ? `--oyk-popper-fg: ${theme.popper_fg};` : ""}
        ${theme.popper_item_bg ? `--oyk-popper-item-bg: ${theme.popper_item_bg};` : ""}
        ${theme.popper_item_fg ? `--oyk-popper-item-fg: ${theme.popper_item_fg};` : ""}

        ${theme.card_bg ? `--oyk-card-bg: ${theme.card_bg};` : ""}
        ${theme.card_fg ? `--oyk-card-fg: ${theme.card_fg};` : ""}
        ${theme.card_subtle_bg ? `--oyk-card-subtle-bg: ${theme.card_subtle_bg};` : ""}
        ${theme.card_subtle_fg ? `--oyk-card-subtle-fg: ${theme.card_subtle_fg};` : ""}
        ${theme.card_item_bg ? `--oyk-card-item-bg: ${theme.card_item_bg};` : ""}
        ${theme.card_item_fg ? `--oyk-card-item-fg: ${theme.card_item_fg};` : ""}
        ${theme.card_item_subtle ? `--oyk-card-item-subtle: ${theme.card_item_subtle};` : ""}
        ${theme.card_divider ? `--oyk-card-divider: ${theme.card_divider};` : ""}

        ${theme.scrollbar ? `--oyk-scrollbar: ${theme.scrollbar};` : ""}

        ${theme.radius ? `--oyk-radius: ${theme.radius};` : ""}
      }
    `;
  };

  const clearUniverseTheme = () => {
    const style = document.getElementById("oyk-universe-theme");
    if (style) style.remove();
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
    applyUniverseTheme();

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
        currentUniverse: universe,
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
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
