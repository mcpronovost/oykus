import type { ReactNode } from "react";
import { oykClass } from "@/utils";

interface OykStatsProps {
  children: ReactNode;
  justify?: "start" | "center" | "end";
  reverse?: boolean;
}

interface OykStatProps {
  label: string;
  value: string | number;
  valueColor?: "accent" | "success" | "danger" | "info" | "warning" | "special";
}

function OykStat({ label, value, valueColor }: OykStatProps) {
  return (
    <dl className="oyk-stats-item">
      <dt className="oyk-stats-label">{label}</dt>
      <dd className="oyk-stats-value" style={ valueColor ? { color: `var(--oyk-c-${valueColor})` } : undefined }>{value}</dd>
    </dl>
  );
}

const OykStats = Object.assign(
  function OykStats({
    children,
    justify = "center",
    reverse = true,
  }: OykStatsProps) {
    if (!children) return null;

    return (
      <div
        className={oykClass(
          "oyk-stats",
          justify && `oyk-justify--${justify}`,
          reverse && "oyk-reverse",
        )}
      >
        {children}
      </div>
    );
  },
  {
    Item: OykStat,
  },
);

export default OykStats;
