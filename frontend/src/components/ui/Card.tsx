import type { MouseEvent } from "react";
import { oykClass } from "@/utils";

type OykCardProps = {
  children: React.ReactNode;
  pad?: "sm" | "md" | "lg" | "xl";
  gradient?: "accent" | "success" | "danger" | "info" | "warning" | "special";
  color?: string;
  outlined?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  grow?: boolean;
  nop?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export default function OykCard({
  children,
  pad = "md",
  gradient,
  color,
  outlined = false,
  hoverable = false,
  clickable = false,
  grow = false,
  nop = false,
  onClick,
}: OykCardProps) {
  return (
    <div
      className={oykClass(
        "oyk-card",
        pad && `oyk-card-pad-${pad}`,
        gradient && `oyk-card-gradient-${gradient}`,
        color && `oyk-card-color--${color}`,
        outlined && "oyk-card-outlined",
        hoverable && "oyk-card-hoverable",
        clickable && "oyk-card-clickable",
        grow && "oyk-card-grow",
        nop && "oyk-card-nop",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
