import { OykCoreHeader, OykCoreSidebar } from "@/components/core";
import { OykScrollbar } from "@/components/ui";

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
        <div className="oyk-core-main-content">
          <OykScrollbar>
            {children}
          </OykScrollbar>
        </div>
      </div>
    </div>
  );
}
