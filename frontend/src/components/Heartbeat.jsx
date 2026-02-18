import { useEffect } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useWorld } from "@/services/world";
import { useNotifications } from "@/services/notifications";

const INTERVAL = 1000 * 30; // 30 sec

export default function OykHeartbeat() {
  const auth = useAuth();
  const world = useWorld();
  const notif = useNotifications();

  useEffect(() => {
    if (!auth.isAuth) return;

    let controller = new AbortController();

    const tick = async () => {
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
