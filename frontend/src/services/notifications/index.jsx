import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { isAuth } = useAuth();

  const [notifications, setNotifications] = useState({
    alerts: 0,
    friends: 0,
    messages: 0,
  });

  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // ---------------------------------------------------------
  // Fetch notifications
  // ---------------------------------------------------------
  const fetchNotifications = async (signal) => {
    if (!isAuth) return;

    setIsLoadingNotifications(true);

    try {
      const r = await api.get("/auth/me/notifications/", signal ? { signal } : {});
      if (!r?.ok) throw new Error();

      setNotifications({
        alerts: r.alerts || 0,
        friends: r.friends || 0,
        messages: r.messages || 0,
      });
    } catch {
      // fail silently
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const updateNotifications = (value) => {
    setNotifications(value);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isLoadingNotifications,
        fetchNotifications,
        updateNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
  return ctx;
}
