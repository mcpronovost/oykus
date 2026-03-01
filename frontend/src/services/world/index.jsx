import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { getUniverseSlugFromPath } from "@/services/router/utils";
import { storeGet, storeSet, storeRemove, oykCookieSet, oykCookieDelete } from "@/services/store/utils";

import { KEY_UNIVERSES, KEY_UNIVERSE } from "./constants";

const WorldContext = createContext(null);

export function WorldProvider({ children }) {
  const { isAuth } = useAuth();

  const [universes, setUniverses] = useState(() => storeGet(KEY_UNIVERSES) || null);
  const [currentUniverse, setCurrentUniverse] = useState(() => storeGet(KEY_UNIVERSE) || null);
  const [theme, setTheme] = useState(null);
  const [isLoadingWorld, setIsLoadingWorld] = useState(false);

  // ---------------------------------------------------------
  // Fetch universes list
  // ---------------------------------------------------------
  const fetchUniverses = async (signal) => {
    if (!isAuth) return;

    try {
      const r = await api.get("/world/universes/", signal ? { signal } : {});
      if (!r.ok || !r.universes) throw Error();

      setUniverses(r.universes);
      storeSet(KEY_UNIVERSES, r.universes);

      // Determine which universe to load
      const slugFromPath = getUniverseSlugFromPath(window.location.pathname);
      const fallbackSlug = currentUniverse?.slug || r.universes?.[0]?.slug;
      const slug = slugFromPath || fallbackSlug;

      if (slug) fetchCurrentUniverse(slug, signal);
    } catch {
      setUniverses([]);
      storeRemove(KEY_UNIVERSES);
    }
  };

  // ---------------------------------------------------------
  // Fetch a specific universe
  // ---------------------------------------------------------
  const fetchCurrentUniverse = async (slug, signal) => {
    if (!slug) return;

    setIsLoadingWorld(true);

    try {
      const r = await api.get(`/world/universes/${slug}/`, signal ? { signal } : {});
      if (!r.ok || !r.universe) throw Error();

      setCurrentUniverse(r.universe);
      storeSet(KEY_UNIVERSE, r.universe);

      // World cookie
      oykCookieSet("oyk-world", r.universe.slug);

      // Theme data
      if (r.theme) setTheme(r.theme);
      else setTheme(null);
    } catch {
      setCurrentUniverse(null);
      storeRemove(KEY_UNIVERSE);
      oykCookieDelete("oyk-world");
      setTheme(null);
    } finally {
      setIsLoadingWorld(false);
    }
  };

  // ---------------------------------------------------------
  // Apply theme to <style>
  // ---------------------------------------------------------
  const applyTheme = (theme) => {
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
        ${
          theme.variables
            ? Object.entries(theme.variables)
                .map(([k, v]) => `--oyk-${k}: ${v};`)
                .join("\n")
            : ""
        }
      }
    `;
  };

  const clearTheme = () => {
    const styleNode = document.getElementById("oyk-theme");
    if (styleNode) styleNode.remove();
  };

  // Apply theme when it changes
  useEffect(() => {
    if (theme) applyTheme(theme);
    return () => clearTheme();
  }, [theme]);

  // ---------------------------------------------------------
  // Reset or fetch when auth changes
  // ---------------------------------------------------------
  useEffect(() => {
    let controller = new AbortController();

    fetchUniverses(controller.signal);

    return () => controller.abort();
  }, [isAuth]);

  return (
    <WorldContext.Provider
      value={{
        universes,
        currentUniverse,
        isLoadingWorld,
        changeUniverse: fetchCurrentUniverse,
        getUniverses: fetchUniverses,
        setUniverses,
        setCurrentUniverse
      }}
    >
      {children}
    </WorldContext.Provider>
  );
}

export function useWorld() {
  const ctx = useContext(WorldContext);
  if (!ctx) {
    window.location.reload();
    // throw new Error("useWorld must be used inside <WorldProvider>");
  }
  return ctx;
}
