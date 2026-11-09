import { oykClass } from "@/utils";

type OykCardProps = {
  children: React.ReactNode;
  pad?: "sm" | "md" | "lg" | "xl";
  gradient?:
    | null
    | "accent"
    | "success"
    | "danger"
    | "info"
    | "warning"
    | "special";
  outlined?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  nop?: boolean;
};

export default function OykCard({
  children,
  pad = "md",
  gradient = null,
  outlined = false,
  hoverable = false,
  clickable = false,
  nop = false,
}: OykCardProps) {
  return (
    <div
      className={oykClass(
        "oyk-card",
        pad && `oyk-card-pad-${pad}`,
        gradient && `oyk-card-gradient-${gradient}`,
        outlined && "oyk-card-outlined",
        hoverable && "oyk-card-hoverable",
        clickable && "oyk-card-clickable",
        nop && "oyk-card-nop",
      )}
    >
      {children}
    </div>
  );
}
