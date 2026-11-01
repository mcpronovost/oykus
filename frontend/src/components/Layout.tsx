import { OykCoreHeader, OykCoreSidebar } from "@/components/core";

interface OykLayoutProps {
  children: React.ReactNode;
  hidden?: boolean;
}

export default function OykLayout({ children, hidden }: OykLayoutProps) {
  if (hidden) return children;

  return (
    <div className="oyk-core">
      <OykCoreHeader />
      <OykCoreSidebar />
      <div className="oyk-core-main">
        <div className="oyk-core-main-content">{children}</div>
      </div>
    </div>
  );
}
