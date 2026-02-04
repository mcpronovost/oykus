import { createContext, useContext, useState, useCallback } from "react";

import { storeGet, storeSet } from "./utils";

export const KEY_APP_SIDEBAR_OPEN = "app-sidebar-open";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeAppSidebarOpen, setStoreAppSidebarOpen] = useState(() => {
    return storeGet(KEY_APP_SIDEBAR_OPEN) ?? true;
  });

  const handleSetStoreAppSidebarOpen = useCallback((value) => {
    storeSet(KEY_APP_SIDEBAR_OPEN, value);
    setStoreAppSidebarOpen(value);
  }, []);

  const value = {
    // App
    storeAppSidebarOpen,
    setStoreAppSidebarOpen: handleSetStoreAppSidebarOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
