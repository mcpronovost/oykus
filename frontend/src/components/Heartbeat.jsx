import { useEffect, useRef } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useWorld } from "@/services/world";
import { useNotifications } from "@/services/notifications";

const INTERVAL = 1000 * 30; // 30 sec
const ACTIVITY_TIMEOUT = 1000 * 60 * 10; // 10 min

export default function OykHeartbeat() {
  const { isAuth, setUser } = useAuth();
  const { n } = useRouter();
  const { changeUniverse, setCurrentUniverse, setUniverses } = useWorld();
  const { updateNotifications } = useNotifications();

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
    // if (!isAuth) return;

    let controller = new AbortController();

    const isActive = () => {
      return Date.now() - lastActivityRef.current < ACTIVITY_TIMEOUT;
    };

    const tick = async () => {
      if (!isActive()) return;

      try {
        const r = await api.get("/heartbeat/", { signal: controller.signal });
        if (!r.ok) throw r;

        // Update
        if (r.user) setUser(r.user);
        if (r.world) {
          if (r.world.current) setCurrentUniverse(r.world.current);
          if (r.world.universes) setUniverses(r.world.universes);
        }
        if (r.notifications) updateNotifications(r.notifications);
      } catch {
        // changeUniverse("oykus");
      }
    };

    tick();
    const id = setInterval(tick, INTERVAL);

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [isAuth]);

  return null;
}
