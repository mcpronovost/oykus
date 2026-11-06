import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/services/auth";
import { RouterProvider, useRouter } from "@/services/router";
import { TranslationProvider } from "@/services/translation";

type OykProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
});

function OykLocale({ children }: OykProvidersProps) {
  const { lang } = useRouter();

  return <TranslationProvider lang={lang}>{children}</TranslationProvider>;
}

export default function OykProviders({ children }: OykProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider>
          <OykLocale>{children}</OykLocale>
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
