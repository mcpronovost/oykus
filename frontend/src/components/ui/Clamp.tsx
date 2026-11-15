import type { ReactNode } from "react";
import { oykClass } from "@/utils";

type OykClampTag = "p" | "span" | "div";
type OykClampLines = 1 | 2 | 3 | 4 | 5 | 6;

type OykClampProps = {
  children: ReactNode;
  lines?: OykClampLines;
  as?: OykClampTag;
  className?: string;
};

export default function OykClamp({
  children,
  lines = 3,
  as = "p",
  className,
}: OykClampProps) {
  const clampClassName = oykClass("oyk-clamp", `oyk-clamp-${lines}`, className);

  switch (as) {
    case "span":
      return <span className={clampClassName}>{children}</span>;
    case "div":
      return <div className={clampClassName}>{children}</div>;
    default:
      return <p className={clampClassName}>{children}</p>;
  }
}
