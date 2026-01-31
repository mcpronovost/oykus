import { AuthProvider } from "@/services/auth";
import { RouterProvider } from "@/services/router";
import { StoreProvider } from "@/services/store";
import { TranslationProvider } from "@/services/translation";

export default function OykProviders({ children }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <RouterProvider>
          <TranslationProvider>{children}</TranslationProvider>
        </RouterProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
