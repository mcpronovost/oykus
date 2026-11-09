import { oykClass } from "@/utils";

interface OykDividerProps {
  label?: undefined | string;
  start?: undefined | string;
  end?: undefined | string;
  nop?: boolean;
}

export default function OykDivider({
  label,
  start,
  end,
  nop = false,
}: OykDividerProps) {
  return (
    <div className="oyk-divider">
      {start && (<div className="oyk-divider-start">{start}</div>)}
      <div className="oyk-divider-line"></div>
      {label && (<div className="oyk-divider-label">{label}</div>)}
      <div className="oyk-divider-line"></div>
      {end && (<div className="oyk-divider-end">{end}</div>)}
    </div>
  );
}
