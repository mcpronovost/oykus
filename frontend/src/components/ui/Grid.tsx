import { oykClass } from "@/utils";

type BreakpointType = "sm" | "md" | "lg" | "xl";
type SizeType = number | ({ xs?: number } & Partial<Record<BreakpointType, number>>);

interface OykGridProps {
  children: React.ReactNode;
}

interface OykGridRowProps {
  children: React.ReactNode;
}

interface OykGridColProps {
  children: React.ReactNode;
  size?: SizeType;
}

function buildClasses(prefix: string, value?: SizeType): string[] {
  if (value === undefined) return [];
  if (typeof value === "number") return [`${prefix}--${value}`];

  const classes: string[] = [];
  if (value.xs !== undefined) classes.push(`${prefix}--${value.xs}`);
  (["sm", "md", "lg", "xl"] as BreakpointType[]).forEach((bp) => {
    const v = value[bp as BreakpointType];
    if (v !== undefined) classes.push(`${prefix}--${bp}-${v}`);
  });
  return classes;
}

function OykGridRow({ children }: OykGridRowProps) {
  return <div className="oyk-grid-row">{children}</div>;
}

function OykGridCol({ children, size = 24 }: OykGridColProps) {
  return (
    <div className={oykClass("oyk-grid-col", ...buildClasses("oyk-grid-col-size", size))}>
      {children}
    </div>
  );
}

const OykGrid = Object.assign(
  function OykGrid({ children }: OykGridProps) {
    return <div className="oyk-grid">{children}</div>;
  },
  {
    Row: OykGridRow,
    Col: OykGridCol,
  },
);

export default OykGrid;
