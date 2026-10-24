type OykCardProps = {
  children: React.ReactNode;
};

export default function OykCard({ children }: OykCardProps) {
  return (
    <div className="oyk-card">
      {children}
    </div>
  );
}