import { oykClass } from "@/utils";

interface OykDividerProps {
  variant?: "default" | "subtle";
  nop?: boolean;
  className?: string;
}

export default function OykDivider({
  variant = "default",
  nop = false,
  className,
}: OykDividerProps) {
  return (
    <hr
      className={oykClass(
        "oyk-divider",
        `oyk-divider-variant--${variant}`,
        nop && "oyk-divider-nop",
        className,
      )}
    />
  );
}
