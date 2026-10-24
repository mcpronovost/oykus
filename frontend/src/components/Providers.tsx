import type { ReactNode } from "react";

type OykProvidersProps = {
  children: ReactNode;
};

export default function OykProviders({ children }: OykProvidersProps) {
  return children;
}
