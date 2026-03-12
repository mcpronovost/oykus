import { useEffect, useRef } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useWorld } from "@/services/world";
import { useNotifications } from "@/services/notifications";

const INTERVAL = 1000 * 30; // 30 sec
const ACTIVITY_TIMEOUT = 1000 * 60 * 10; // 10 min

export default function OykHeartbeat() {
  const auth = useAuth();
  const world = useWorld();
  const notif = useNotifications();

  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    // Track user activity
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("touchstart", updateActivity);
    window.addEventListener("touchmove", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
      window.removeEventListener("touchmove", updateActivity);
    };
  }, []);

  useEffect(() => {
    if (!auth.isAuth) return;

    let controller = new AbortController();

    const isActive = () => {
      return Date.now() - lastActivityRef.current < ACTIVITY_TIMEOUT;
    };

    const tick = async () => {
      if (!isActive()) return;

      try {
        const r = await api.get("/heartbeat/", { signal: controller.signal });
        if (!r.ok) return;

        // Update
        if (r.user) auth.setUser(r.user);
        if (r.world) {
          if (r.world.current) world.setCurrentUniverse(r.world.current);
          if (r.world.universes) world.setUniverses(r.world.universes);
        }
        if (r.notifications) notif.updateNotifications(r.notifications);
      } catch {
        // fail silently
      }
    };

    tick();
    const id = setInterval(tick, INTERVAL);

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [auth.isAuth]);

  return null;
}
