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

  const setUser = (user) => {
    if (user) {
      const payload = {
        ...user,
        lastUpdate: Date.now(),
      }
      setUserState(() => payload);
      storeSet(KEY_USER, payload);
      setIsAuth(true);
    } else {
      setUserState(null);
      storeRemove(KEY_USER);
      setIsAuth(false);
    }
  };

  const setRat = (rat) => {
    if (rat) {
      storeSet(KEY_RAT, rat);
    } else {
      storeRemove(KEY_RAT);
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
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
          setRat(null);
          setUser(null);
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
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: user, setUser, setRat, isAuth }}>
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