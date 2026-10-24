import type { ReactNode } from "react";
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
    <RouterProvider>
      <OykLocale>{children}</OykLocale>
    </RouterProvider>
  );
}
