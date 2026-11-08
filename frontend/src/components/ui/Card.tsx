import { oykClass } from "@/utils";

type OykCardProps = {
  children: React.ReactNode;
  pad?: "sm" | "md" | "lg" | "xl";
  gradient?: null | "accent" | "success" | "danger" | "info" | "warning" | "special";
  hoverable?: boolean;
};

export default function OykCard({ children, pad = "md", gradient = null, hoverable = false }: OykCardProps) {
  return (
    <div className={oykClass("oyk-card", pad && `oyk-card-pad-${pad}`, gradient && `oyk-card-gradient-${gradient}`, hoverable && "oyk-card-hoverable")}>
      {children}
    </div>
  );
}