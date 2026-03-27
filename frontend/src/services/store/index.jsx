import { createContext, useContext, useState, useCallback } from "react";

import { storeGet, storeSet } from "./utils";

export const KEY_NAVBAR_OPEN = "core-navbar-open";
export const KEY_GAMEBAR_OPEN = "core-gamebar-open";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeCoreNavbarOpen, setStoreCoreNavbarOpen] = useState(() => {
    return storeGet(KEY_NAVBAR_OPEN) ?? true;
  });
  const [storeCoreGamebarOpen, setStoreCoreGamebarOpen] = useState(() => {
    return storeGet(KEY_GAMEBAR_OPEN) ?? true;
  });

  const handleSetStoreCoreNavbarOpen = useCallback((value) => {
    storeSet(KEY_NAVBAR_OPEN, value);
    setStoreCoreNavbarOpen(value);
  }, []);

  const handleSetStoreCoreGamebarOpen = useCallback((value) => {
    storeSet(KEY_GAMEBAR_OPEN, value);
    setStoreCoreGamebarOpen(value);
  }, []);

  const value = {
    // Core
    storeCoreNavbarOpen,
    setStoreCoreNavbarOpen: handleSetStoreCoreNavbarOpen,
    storeCoreGamebarOpen,
    setStoreCoreGamebarOpen: handleSetStoreCoreGamebarOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
