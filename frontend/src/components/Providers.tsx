import type { ReactNode } from "react";
import { AuthProvider } from "@/services/auth";
import { RouterProvider, useRouter } from "@/services/router";
import { TranslationProvider } from "@/services/translation";

type OykProvidersProps = {
  children: ReactNode;
};

function OykLocale({ children }: OykProvidersProps) {
  const { lang } = useRouter();

  return <TranslationProvider lang={lang}>{children}</TranslationProvider>;
}

export default function OykProviders({ children }: OykProvidersProps) {
  return (
    <AuthProvider>
      <RouterProvider>
        <OykLocale>{children}</OykLocale>
      </RouterProvider>
    </AuthProvider>
  );
}
