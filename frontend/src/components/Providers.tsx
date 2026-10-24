import type { ReactNode } from "react";

type OykProvidersProps = {
  children: ReactNode;
};

function OykProviders({ children }: OykProvidersProps) {
  return children;
}

export { OykProviders };
