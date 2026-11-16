import type { HTMLAttributes } from "react";
import { oykClass, oykCode } from "@/utils";

type OykCodeTag = "div" | "span" | "p" | "article";

interface OykCodeProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "content"> {
  content?: string | null;
  children?: string;
  as?: OykCodeTag;
  className?: string;
}

export default function OykCode({
  content,
  children,
  as = "p",
  className,
  ...props
}: OykCodeProps) {
  const text = content ?? children ?? "";
  const html = oykCode(text);
  const classNames = oykClass("oyk-code", className);

  switch (as) {
    case "span":
      return <span {...props} className={classNames} dangerouslySetInnerHTML={{ __html: html }} />;
    case "div":
      return <div {...props} className={classNames} dangerouslySetInnerHTML={{ __html: html }} />;
    case "article":
      return <article {...props} className={classNames} dangerouslySetInnerHTML={{ __html: html }} />;
    default:
      return <p {...props} className={classNames} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}
