import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { KEY_RAT, KEY_USER } from "@/services/store/constants";
import { storeGet, storeSet, storeRemove } from "@/services/store/utils";

const REFRESH_INTERVAL = 10 * 60 * 5; // 5 minutes = 1000 * 60 * 5

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const encodedUser = storeGet(KEY_USER);
    return encodedUser ? encodedUser : null;
  });
  const [isAuth, setIsAuth] = useState(() => {
    return user ? true : false;
  });
  const [isDev, setIsDev] = useState(() => {
    return user && user.is_dev ? true : false;
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
    }
  };

  const setRat = (rat) => {
    if (rat) {
      storeSet(KEY_RAT, rat);
    } else {
      storeRemove(KEY_RAT);
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

  // Check for existing auth on mount
  useEffect(() => {
    const controller = new AbortController();
    const interval = setInterval(fetchNotifications, (1 * 60 * 1000));

    const checkAuth = async () => {
      const token = storeGet(KEY_RAT);
      if (token) {
        try {
          // Validate token with backend
          const response = await api.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            throw new Error("Invalid token");
          }
        } catch {
          if (import.meta.env.PROD) {
            setRat(null);
            setUser(null);
          }
        }
      }
    };

    if (user?.lastUpdate) {
      const now = Date.now();
      if (now - user?.lastUpdate > REFRESH_INTERVAL) {
        checkAuth();
      }
    } else {
      checkAuth();
    }

    setTimeout(() => {
      fetchNotifications(controller.signal);
    }, 1000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser: user,
      setUser,
      setRat,
      isAuth,
      isDev,
      getUserNotifications: fetchNotifications,
    }}>
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
