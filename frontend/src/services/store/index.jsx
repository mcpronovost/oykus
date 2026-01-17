import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  KEY_RAT,
  KEY_USER,
  KEY_APP_SIDEBAR_OPEN,
} from "./constants";
import { storeGet, storeSet, storeRemove } from "./utils";
// import { api } from "@/services/api";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return storeGet(KEY_USER);
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = storeGet(KEY_RAT);
    return !!token;
  });
  const [storeAppSidebarOpen, setStoreAppSidebarOpen] = useState(() => {
    return storeGet(KEY_APP_SIDEBAR_OPEN) ?? true;
  });

  const handleSetCurrentUser = useCallback((user) => {
    if (user) {
      storeSet(KEY_USER, user);
      setCurrentUser(user);
    } else {
      storeRemove(KEY_USER);
      setCurrentUser(null);
    }
  }, []);

  const handleSetAuthenticated = useCallback((authenticated) => {
    setIsAuthenticated(authenticated);
  }, []);

  const handleSetStoreAppSidebarOpen = useCallback((value) => {
    storeSet(KEY_APP_SIDEBAR_OPEN, value);
    setStoreAppSidebarOpen(value);
  }, []);

  // Periodic user profile refresh
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Initial profile fetch on mount
    const fetchProfile = async () => {
      try {
        // await api.getUserProfile();
      } catch {
        // Fail silently
      }
    };

    fetchProfile();

    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchProfile, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const value = {
    // Auth
    currentUser,
    setCurrentUser: handleSetCurrentUser,
    isAuthenticated,
    setAuthenticated: handleSetAuthenticated,
    // Manual refresh function
    refreshUserProfile: async () => {
      if (isAuthenticated) {
        try {
          // await api.getUserProfile();
        } catch (error) {
          console.warn("Failed to refresh user profile:", error);
          throw error;
        }
      }
    },
    // App
    storeAppSidebarOpen,
    setStoreAppSidebarOpen: handleSetStoreAppSidebarOpen,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
