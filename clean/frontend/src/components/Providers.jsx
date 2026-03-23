import { AuthProvider } from "@/services/auth";
import { NotificationsProvider } from "@/services/notifications";
import { RouterProvider } from "@/services/router";
import { StoreProvider } from "@/services/store";
import { TranslationProvider } from "@/services/translation";
import { WorldProvider } from "@/services/world";
import OykHeartbeat from "./Heartbeat";

export default function OykProviders({ children }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <RouterProvider>
          <TranslationProvider>
            <WorldProvider>
              <NotificationsProvider>
                <OykHeartbeat />
                {children}
              </NotificationsProvider>
            </WorldProvider>
          </TranslationProvider>
        </RouterProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
