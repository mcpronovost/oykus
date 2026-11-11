import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { oykClass } from "@/utils";

interface OykListProps {
  children: ReactNode;
}

interface OykListItemProps {
  content: string | ReactNode;
  start?: Icon;
  end?: Icon;
  color?: "default" | "accent" | "success" | "danger" | "info" | "warning" | "special";
}

function OykListItem({ content, start: StartIcon, end: EndIcon, color = "default" }: OykListItemProps) {
  if (!content) return null;

  return (
    <li className={oykClass("oyk-list-item", `oyk-color-${color}`)}>
      {StartIcon && (
        <span className="oyk-list-item-start">
          <StartIcon size={18} />
        </span>
      )}
      <div className="oyk-list-item-content">{content}</div>
      {EndIcon && (
        <span className="oyk-list-item-end">
          <EndIcon size={18} />
        </span>
      )}
    </li>
  );
}

const OykList = Object.assign(
  function OykList({ children }: OykListProps) {
    if (!children) return null;

    return <ul className="oyk-list">{children}</ul>;
  },
  {
    Item: OykListItem,
  },
);

export default OykList;
