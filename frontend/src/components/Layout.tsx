interface OykLayoutProps {
  children: React.ReactNode;
}

export default function OykLayout({ children }: OykLayoutProps) {
  return (
    <div className="oyk-core">
      <div className="oyk-core-nav">
        <div className="oyk-core-nav-bar">
          aaa
        </div>
      </div>
      <div className="oyk-core-main">
        {children}
      </div>
    </div>
  );
}
